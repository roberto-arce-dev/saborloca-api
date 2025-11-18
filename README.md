# /Users/roberto/Documents/GitHub/saborlocal-api

## Endpoints

### Upload
- POST /api/upload/image
- POST /api/upload/images
- DELETE /api/upload/image/:filename

### Entidades
#### Productor
- GET /api/productor
- POST /api/productor

#### Producto
- POST /api/producto/:id/upload-image (✅ Upload)
- GET /api/producto
- POST /api/producto

#### Pedido
- GET /api/pedido
- POST /api/pedido

#### Cliente
- GET /api/cliente
- POST /api/cliente

#### Entrega
- GET /api/entrega
- POST /api/entrega


---

## 🔐 Autenticación y Autorización

### Sistema de Roles

Este proyecto implementa autenticación JWT con los siguientes roles:

- **ADMIN**: Acceso total al sistema
- **USUARIO**: Rol específico para USUARIO
- **CONDUCTOR**: Rol específico para CONDUCTOR
- **PASAJERO**: Rol específico para PASAJERO

### Usuario Administrador por Defecto

```
Email: admin@sistema.com
Password: Admin123456
```

**⚠️ IMPORTANTE**: Cambiar estas credenciales en producción.

### Endpoints de Autenticación

#### Registro
```bash
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "USUARIO"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sistema.com",
  "password": "Admin123456"
}

# Respuesta:
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@sistema.com",
      "role": "ADMIN"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Obtener Perfil (requiere autenticación)
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Listar Usuarios (solo ADMIN)
```bash
GET /api/auth/users
Authorization: Bearer <token>
```

### Protección de Rutas

Todas las rutas están protegidas por defecto. Para rutas públicas, usa el decorador `@Public()`:

```typescript
import { Public } from './auth/decorators/public.decorator';

@Public()
@Get('public-endpoint')
publicEndpoint() {
  return 'Este endpoint es público';
}
```

### Uso de Roles en Controladores

```typescript
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './auth/enums/roles.enum';

@Roles(Role.ADMIN)
@Delete(':id')
adminOnlyEndpoint() {
  return 'Solo administradores';
}

@Roles(Role.ADMIN, Role.USUARIO)
@Get()
multipleRoles() {
  return 'Administradores y usuarios';
}
```

### Obtener Usuario Actual

```typescript
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Get('my-data')
getMyData(@CurrentUser() user: any) {
  return {
    userId: user.userId,
    email: user.email,
    role: user.role
  };
}
```

### Ejemplos con cURL

```bash
# 1. Login
curl -X POST http://localhost:3008/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sistema.com",
    "password": "Admin123456"
  }'

# 2. Obtener perfil (usar token del login)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:3008/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Crear producto (con autenticación)
curl -X POST http://localhost:3008/api/producto \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Producto nuevo",
    "descripcion": "Descripción del producto"
  }'
```

### Configuración de Seguridad

Variables de entorno importantes:

```env
JWT_SECRET=cambiar-esto-en-produccion
JWT_EXPIRES_IN=24h
```

**Recomendaciones de Seguridad:**

1. ✅ Cambiar JWT_SECRET en producción
2. ✅ Usar HTTPS en producción
3. ✅ Configurar CORS apropiadamente
4. ✅ Cambiar credenciales de admin
5. ✅ Implementar rate limiting
6. ✅ Usar refresh tokens para sesiones largas

---

## 📚 Documentación Swagger

### Acceder a Swagger UI

Una vez iniciado el servidor, la documentación interactiva está disponible en:

```
http://localhost:3008/api/docs
```

### Características de Swagger

- ✅ **Interfaz interactiva**: Prueba todos los endpoints desde el navegador
- ✅ **Autenticación JWT**: Botón "Authorize" para agregar el token
- ✅ **Schemas documentados**: Todos los DTOs y respuestas
- ✅ **Try it out**: Ejecuta requests directamente

### Uso de Swagger

1. **Login**:
   - Ir a `POST /api/auth/login`
   - Click en "Try it out"
   - Usar credenciales: `admin@sistema.com` / `Admin123456`
   - Copiar el `access_token` de la respuesta

2. **Autorizar**:
   - Click en botón "Authorize" (🔒) arriba a la derecha
   - Pegar el token (sin "Bearer")
   - Click "Authorize"

3. **Probar endpoints protegidos**:
   - Ahora puedes probar `GET /api/auth/profile`, etc.

---

## 📮 Colecciones de Postman / API Dog

### Postman Collection

Importar el archivo en Postman:

```bash
Archivo: postman_collection.json
```

**Características**:
- ✅ Variable `{{baseUrl}}` configurada
- ✅ Variable `{{token}}` auto-guardada después del login
- ✅ Todos los endpoints documentados
- ✅ Ejemplos de request body

### API Dog / OpenAPI

Importar el archivo en API Dog u otra herramienta compatible con OpenAPI 3.0:

```bash
Archivo: openapi.yaml
```

**Importar en API Dog**:
1. Abrir API Dog
2. Import → OpenAPI
3. Seleccionar `openapi.yaml`
4. Todos los endpoints se importarán automáticamente

### Uso de Postman Collection

1. **Importar**:
   - Postman → Import → Upload File
   - Seleccionar `postman_collection.json`

2. **Login automático**:
   - Ejecutar request "Login"
   - El token se guarda automáticamente en `{{token}}`

3. **Usar token**:
   - Todos los otros requests usan automáticamente el token

---

## 🧪 Testing Rápido

### Con cURL

```bash
# 1. Login
curl -X POST http://localhost:3008/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sistema.com","password":"Admin123456"}'

# Copiar el access_token de la respuesta

# 2. Usar token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:3008/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Con Postman

1. Importar `postman_collection.json`
2. Ejecutar "Login" → Token se guarda automáticamente
3. Ejecutar cualquier otro endpoint

### Con Swagger

1. Abrir http://localhost:3008/api/docs
2. Login → Copiar token
3. Click "Authorize" → Pegar token
4. Probar endpoints

