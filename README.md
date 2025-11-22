# SaborLocal API

## Descripción

YA IMPLEMENTADO - Clientes y productores locales

API RESTful construida con NestJS, MongoDB y arquitectura DDD (Domain-Driven Design) que separa la autenticación (User) del dominio de negocio (Profiles).

## Tecnologías

- **Framework:** NestJS
- **Base de datos:** MongoDB con Mongoose
- **Autenticación:** JWT (JSON Web Tokens)
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI
- **Rate Limiting:** @nestjs/throttler
- **Upload de archivos:** Multer + Sharp (thumbnails)

## Arquitectura

### Patrón DDD (Domain-Driven Design)

**Separación de dominios:**
- **Dominio de Autenticación:** `User` (email, password, role)
- **Dominio de Negocio:** `Profiles` (datos específicos de cada rol)

**Factory Pattern:** El servicio de autenticación crea automáticamente el Profile correspondiente según el rol del usuario durante el registro.

### Roles del Sistema

- **CLIENTE**
- **PRODUCTOR**
- **ADMIN**

### Profiles

- **ClienteProfile** (rol: CLIENTE)
- **ProductorProfile** (rol: PRODUCTOR)

### Entidades de Negocio

- Producto
- Pedido
- Entrega

---

## Instalación

### Requisitos Previos

- Node.js 18+
- npm o yarn
- MongoDB 4.4+

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd saborlocal-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/saborlocal_db

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Puerto
PORT=3009

# Node Environment
NODE_ENV=development
```

Para producción, crear `.env.production`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/saborlocal_db
JWT_SECRET=otro_secreto_diferente_para_produccion
JWT_EXPIRES_IN=7d
PORT=3009
NODE_ENV=production
```

4. **Compilar el proyecto**
```bash
npm run build
```

---

## Ejecución

### Modo Desarrollo
```bash
npm run start:dev
```

### Modo Producción
```bash
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3009`

---

## Documentación API (Swagger)

Una vez iniciado el servidor, accede a la documentación interactiva:

**URL:** `http://localhost:3009/api`

Swagger proporciona:
- Lista completa de endpoints
- Modelos de datos
- Posibilidad de probar endpoints directamente
- Ejemplos de requests y responses

---

## Endpoints Principales

### Autenticación

#### Registrar Usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "role": "CLIENTE",
  "nombre": "Juan Pérez",
  "telefono": "+51 987654321"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "CLIENTE",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Roles disponibles para registro:**
- `CLIENTE`
- `PRODUCTOR`

#### Iniciar Sesión
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "CLIENTE"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Obtener Información del Usuario Autenticado
```bash
GET /api/auth/me
Authorization: Bearer {access_token}
```

#### Refrescar Token
```bash
POST /api/auth/refresh
Authorization: Bearer {access_token}
```

---

## Profiles

### ClienteProfile

**Rol asociado:** `CLIENTE`

**Endpoints disponibles:**

#### Obtener mi perfil
```bash
GET /api/cliente-profile/me
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",

  "nombre": "Valor de ejemplo",
  "telefono": "Valor de ejemplo",
  "direccion": "Valor de ejemplo"
,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Actualizar mi perfil
```bash
PUT /api/cliente-profile/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Valor de ejemplo",
  "telefono": "Valor de ejemplo",
  "direccion": "Valor de ejemplo"
}
```

#### Listar todos los perfiles (Admin)
```bash
GET /api/cliente-profile
Authorization: Bearer {token_admin}
```

#### Obtener perfil por userId (Admin)
```bash
GET /api/cliente-profile/{userId}
Authorization: Bearer {token_admin}
```


### ProductorProfile

**Rol asociado:** `PRODUCTOR`

**Endpoints disponibles:**

#### Obtener mi perfil
```bash
GET /api/productor-profile/me
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",

  "nombreNegocio": "Valor de ejemplo",
  "nombreContacto": "Valor de ejemplo",
  "telefono": "Valor de ejemplo"
,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Actualizar mi perfil
```bash
PUT /api/productor-profile/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombreNegocio": "Valor de ejemplo",
  "nombreContacto": "Valor de ejemplo",
  "telefono": "Valor de ejemplo"
}
```

#### Listar todos los perfiles (Admin)
```bash
GET /api/productor-profile
Authorization: Bearer {token_admin}
```

#### Obtener perfil por userId (Admin)
```bash
GET /api/productor-profile/{userId}
Authorization: Bearer {token_admin}
```


---



---

## 📸 Crear Productos con Imágenes

### ⚠️ IMPORTANTE: La imagen es OPCIONAL

La imagen **NO es requerida** al crear un producto. Puedes:
- ✅ Crear el producto SIN imagen
- ✅ Agregar la imagen DESPUÉS usando el endpoint de upload

### 🎯 Flujo Recomendado (Paso a Paso)

#### Paso 1: Crear el Producto sin imagen

```bash
POST /api/producto
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Tomates Orgánicos",
  "descripcion": "Tomates frescos de la huerta",
  "precio": 5.5,
  "unidad": "kg",
  "stock": 100,
  "categoria": "verduras"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Tomates Orgánicos",
    "imagen": null,
    "imagenThumbnail": null,
    ...
  }
}
```

**💡 Nota:** Guarda el `_id` del producto creado, lo necesitarás para subir la imagen.

---

#### Paso 2: Subir imagen al Producto

```bash
POST /api/producto/507f1f77bcf86cd799439011/upload-image
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

file: [imagen.jpg]
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Imagen subida y asociada exitosamente",
  "data": {
    "producto": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Tomates Orgánicos",
      "imagen": "uploads/1700000000000-imagen.jpg",
      "imagenThumbnail": "uploads/thumbnails/thumb-1700000000000-imagen.jpg"
    },
    "upload": {
      "url": "uploads/1700000000000-imagen.jpg",
      "thumbnailUrl": "uploads/thumbnails/thumb-1700000000000-imagen.jpg"
    }
  }
}
```

---

### 📮 Cómo Hacerlo en Postman

#### Paso 1: Crear Producto

1. **Abrir la colección** de Postman del proyecto
2. **Ir a:** `Auth` → `Login`
3. **Ejecutar** el login y **copiar** el `access_token`
4. **Ir a:** `Producto` → `Create Producto`
5. **Configurar** el token en Headers:
   ```
   Authorization: Bearer {{access_token}}
   ```
6. **En el Body (JSON):** Pegar el siguiente JSON:
   ```json
   {
  "nombre": "Tomates Orgánicos",
  "descripcion": "Tomates frescos de la huerta",
  "precio": 5.5,
  "unidad": "kg",
  "stock": 100,
  "categoria": "verduras"
}
   ```
7. **Enviar** la petición
8. **Copiar** el `_id` del producto creado

---

#### Paso 2: Subir Imagen

1. **Ir a:** `Upload por Entidad` → `Upload Producto Image`
2. **Reemplazar** `{{id}}` en la URL con el ID copiado:
   ```
   http://localhost:3009/api/producto/507f1f77bcf86cd799439011/upload-image
   ```
3. **Configurar** Headers:
   ```
   Authorization: Bearer {{access_token}}
   ```
4. **En el Body:**
   - Seleccionar tipo: `form-data`
   - Agregar key: `file`
   - Tipo: `File`
   - Seleccionar tu imagen (JPG, PNG, etc.)
5. **Enviar** la petición

**✅ ¡Listo!** Tu producto ahora tiene imagen.

---

### 🖼️ Verificar la Imagen

Una vez subida, puedes ver la imagen en el navegador:

**Imagen original:**
```
http://localhost:3009/uploads/1700000000000-imagen.jpg
```

**Thumbnail (miniatura):**
```
http://localhost:3009/uploads/thumbnails/thumb-1700000000000-imagen.jpg
```

---

### 💻 Ejemplo Completo con curl

```bash
# 1. Login para obtener token
TOKEN=$(curl -X POST http://localhost:3009/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"productor@example.com","password":"password123"}' \
  | jq -r '.access_token')

# 2. Crear Producto
PRODUCTO_ID=$(curl -X POST http://localhost:3009/api/producto \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{   "nombre": "Tomates Orgánicos",   "descripcion": "Tomates frescos de la huerta",   "precio": 5.5,   "unidad": "kg",   "stock": 100,   "categoria": "verduras" }' \
  | jq -r '.data._id')

echo "Producto creado con ID: $PRODUCTO_ID"

# 3. Subir imagen
curl -X POST http://localhost:3009/api/producto/$PRODUCTO_ID/upload-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/ruta/a/tu/imagen.jpg"

echo "✅ Imagen subida exitosamente!"
```

---

### 🔧 Características del Upload

| Característica | Detalle |
|----------------|---------|
| **Formatos soportados** | JPG, JPEG, PNG, GIF, WEBP |
| **Tamaño máximo** | 5 MB por imagen |
| **Thumbnail** | Se genera automáticamente (200x200px) |
| **Ubicación** | `/uploads/` para originales, `/uploads/thumbnails/` para thumbnails |
| **Permisos** | Solo usuarios autenticados (según rol) |

---

### ❌ Errores Comunes

#### Error: "No se proporcionó ningún archivo"
**Causa:** No se envió el archivo o el campo no se llama `file`

**Solución:**
- En Postman: Asegúrate de que el key sea exactamente `file`
- En curl: Verifica que uses `-F "file=@/ruta/imagen.jpg"`

---

#### Error: "El archivo debe ser una imagen"
**Causa:** El archivo no es una imagen válida

**Solución:**
- Verifica que el archivo sea JPG, PNG, GIF o WEBP
- Verifica que el archivo no esté corrupto

---

#### Error: "401 Unauthorized"
**Causa:** Token JWT inválido o expirado

**Solución:**
1. Haz login nuevamente
2. Copia el nuevo access_token
3. Actualiza el header Authorization

---

#### Error: "404 Not Found" al ver la imagen
**Causa:** La ruta de la imagen es incorrecta o el servidor no está sirviendo archivos estáticos

**Solución:**
- Verifica que el servidor esté corriendo
- Verifica que la URL sea exactamente la devuelta por el endpoint de upload
- La URL debe empezar con `http://localhost:3009/uploads/`

---

### 📦 Otras Entidades con Imágenes

Este backend también soporta upload de imágenes para:
- **Pedido**: `POST /api/pedido/{id}/upload-image`

El proceso es idéntico al descrito arriba para Producto.

---

## Rate Limiting

El API implementa rate limiting para proteger contra abuso:

- **short:** 3 requests por segundo
- **medium:** 20 requests por 10 segundos
- **long:** 100 requests por minuto

Si excedes el límite, recibirás un error `429 Too Many Requests`.

---

## Autenticación JWT

### Obtener Token

Después de login o registro, recibirás un `access_token`. Úsalo en las peticiones que requieren autenticación:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Endpoints Protegidos

Todos los endpoints excepto `/auth/register` y `/auth/login` requieren autenticación.

### Roles y Permisos

- **Usuario autenticado:** Puede acceder a sus propios datos (endpoints `/me`)
- **ADMIN:** Puede acceder a todos los datos del sistema

---

## Flujo Completo de Uso

### 1. Registrar un nuevo usuario

```bash
curl -X POST http://localhost:3009/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "password123",
    "role": "CLIENTE",
    "nombre": "Juan Pérez",
    "telefono": "+51 987654321"
  }'
```

### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3009/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "password123"
  }'
```

**Copiar el `access_token` de la respuesta.**

### 3. Obtener mi perfil

```bash
curl -X GET http://localhost:3009/api/cliente-profile/me \
  -H "Authorization: Bearer {access_token}"
```

### 4. Actualizar mi perfil

```bash
curl -X PUT http://localhost:3009/api/cliente-profile/me \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "+51 999888777",
    "direccion": "Nueva dirección"
  }'
```

---

## Colección de Postman

Importa la colección de Postman incluida en el proyecto:

**Archivo:** `saborlocal-api.postman_collection.json`

La colección incluye:
- Todos los endpoints de Auth
- Todos los endpoints de Profiles
- Endpoints de Upload
- Variables de entorno preconfiguradas
- Ejemplos de requests

---

## Testing

### Ejecutar tests
```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

---

## Estructura del Proyecto

```
saborlocal-api/
├── src/
│   ├── auth/                 # Módulo de autenticación
│   │   ├── dto/              # DTOs (register, login)
│   │   ├── schemas/          # Schema de User
│   │   ├── guards/           # Guards JWT y Roles
│   │   ├── decorators/       # Decoradores personalizados
│   │   └── auth.service.ts   # Lógica de autenticación
│   │
│   ├── cliente-profile/  # Profile CLIENTE
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── cliente-profile.controller.ts
│   │   ├── cliente-profile.service.ts
│   │   └── cliente-profile.module.ts
│   │
│   ├── productor-profile/  # Profile PRODUCTOR
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── productor-profile.controller.ts
│   │   ├── productor-profile.service.ts
│   │   └── productor-profile.module.ts
│   │
│   ├── upload/               # Módulo de uploads
│   ├── app.module.ts         # Módulo principal
│   └── main.ts               # Entry point
│
├── uploads/                  # Imágenes subidas
│   └── thumbnails/           # Thumbnails generados
│
├── .env                      # Variables de entorno (development)
├── .env.production           # Variables de entorno (production)
├── saborlocal-api.postman_collection.json
└── package.json
```

---

## Solución de Problemas

### MongoDB no conecta

**Error:** `MongooseError: The 'uri' parameter to 'openUri()' must be a string`

**Solución:** Verifica que la variable `MONGODB_URI` esté configurada en `.env`

### Puerto en uso

**Error:** `EADDRINUSE: address already in use :::3000`

**Solución:** Cambia el puerto en `.env` o detén el proceso que está usando el puerto

### Token JWT inválido

**Error:** `401 Unauthorized`

**Solución:** Verifica que el token esté bien formado y no haya expirado. Genera uno nuevo haciendo login.

### Errores de validación

**Error:** `400 Bad Request - validation failed`

**Solución:** Revisa que todos los campos requeridos estén presentes y tengan el formato correcto. Consulta Swagger para ver los campos requeridos.

---

## Usuario Admin por Defecto

El sistema crea automáticamente un usuario ADMIN al iniciar:

```
Email: admin@sistema.com
Password: Admin123456
Role: ADMIN
```

**⚠️ IMPORTANTE:** Cambia estas credenciales en producción.

---

## Deployment

### Variables de Entorno Requeridas

```env
MONGODB_URI=<mongodb_connection_string>
JWT_SECRET=<secret_key>
JWT_EXPIRES_IN=7d
PORT=3009
NODE_ENV=production
```

### Railway

1. Crear nuevo proyecto en Railway
2. Conectar repositorio
3. Agregar MongoDB (Add Plugin → MongoDB)
4. Configurar variables de entorno
5. Deploy automático

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3009
CMD ["npm", "run", "start:prod"]
```

---

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Licencia

Este proyecto es parte de un ejercicio académico.

---

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Generado:** 2025-11-22
**Version:** 1.0.0
**Framework:** NestJS
**Base de datos:** MongoDB
