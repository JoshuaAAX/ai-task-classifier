from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from . import database, models, schemas, utils
from datetime import datetime, timedelta, timezone
import os

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Devuelve la información completa del usuario logueado
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=[os.getenv("JWT_ALGORITHM")])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        user = db.query(models.User).filter(models.User.email == email, models.User.is_active == True).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado o inactivo")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

# Devuelve la el email del usuario logueado
def get_current_user_email(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=[os.getenv("JWT_ALGORITHM")])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
        

# Registra al usuario
@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # Verificar si el correo o username ya existen
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Correo ya registrado")

    existing_username = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Nombre de usuario ya en uso")

    # Encriptar contraseña
    hashed = utils.hash_password(user.password)

    # Crear nuevo usuario
    new_user = models.User(
        name=user.name,
        username=user.username,
        email=user.email,
        password=hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"msg": "Usuario creado exitosamente", "user": {"name": new_user.name, "email": new_user.email}}

# Loguea al usuario
@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not utils.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = utils.create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

# Ruta que devuelve el email del usuario actual
@router.get("/email")
def get_me(current_user: str = Depends(get_current_user_email)):
    return {"email": current_user}


# Ruta que devuelve toda la información del usuario actual
@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "username": current_user.username,
        "email": current_user.email,
        "is_active": current_user.is_active
    }


@router.put("/update")
def update_user(data: schemas.UserUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    user = current_user

    if data.name:
        user.name = data.name
    if data.username:
        # Evitar duplicados
        if db.query(models.User).filter(models.User.username == data.username, models.User.id != user.id).first():
            raise HTTPException(status_code=400, detail="Nombre de usuario ya en uso")
        user.username = data.username
    if data.email:
        if db.query(models.User).filter(models.User.email == data.email, models.User.id != user.id).first():
            raise HTTPException(status_code=400, detail="Correo ya registrado")
        user.email = data.email

    db.commit()
    db.refresh(user)
    return {"msg": "Usuario actualizado correctamente"}


# por corregir
@router.put("/change-password")
def change_password(data: schemas.ChangePassword, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    if not utils.verify_password(data.old_password, current_user.password):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")

    current_user.password = utils.hash_password(data.new_password)
    db.commit()
    return {"msg": "Contraseña actualizada correctamente"}

# por corregir
@router.delete("/delete")
def delete_user(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    current_user.is_active = False
    db.commit()
    return {"msg": "Usuario eliminado lógicamente (inactivo)"}


@router.post("/forgot-password")
def forgot_password(data: schemas.ForgotPassword, db: Session = Depends(database.get_db)):
    """Solicita un enlace de recuperación. No revela si el correo existe."""
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if user is None:
        return {"msg": "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."}

    # Invalidar enlaces anteriores no usados
    db.query(models.PasswordReset).filter(
        models.PasswordReset.user_id == user.id,
        models.PasswordReset.used == False,
    ).delete()

    token = utils.generate_reset_token()
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    db.add(models.PasswordReset(
        user_id=user.id,
        token_hash=utils.hash_token(token),
        expires_at=now + timedelta(minutes=30),
    ))
    db.commit()

    app_url = os.getenv("APP_URL", "http://localhost:3000")
    reset_link = f"{app_url}/auth/reset-password?token={token}"

    try:
        sent = utils.send_reset_email(user.email, reset_link)
    except Exception:
        sent = False

    if sent:
        return {"msg": "Te enviamos un enlace de recuperación a tu correo."}

    # Sin SMTP configurado: modo demo, devolvemos el enlace para que el flujo funcione
    return {
        "msg": "No hay correo configurado; en modo demo te mostramos el enlace.",
        "reset_link": reset_link,
        "dev_mode": True,
    }


@router.post("/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(database.get_db)):
    """Restablece la contraseña con un token válido, no usado y vigente."""
    reset = db.query(models.PasswordReset).filter(
        models.PasswordReset.token_hash == utils.hash_token(data.token)
    ).first()
    if reset is None:
        raise HTTPException(status_code=400, detail="Token de recuperación inválido")
    if reset.used:
        raise HTTPException(status_code=400, detail="Este enlace ya fue utilizado")
    if reset.expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        raise HTTPException(status_code=400, detail="El enlace de recuperación expiró")

    user = db.query(models.User).filter(models.User.id == reset.user_id).first()
    if user is None:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    user.password = utils.hash_password(data.new_password)
    reset.used = True
    db.commit()
    return {"msg": "Contraseña actualizada correctamente. Ya puedes iniciar sesión."}