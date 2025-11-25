#!/bin/bash

API_URL="https://saborloca-api.onrender.com/api"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Iniciando población de base de datos..."

# Función para registrar productor y crear productos
process_producer() {
    local email=$1
    local password=$2
    local nombre=$3
    local nombreNegocio=$4
    local telefono=$5
    local direccion=$6
    local descripcion=$7

    echo -e "\n👤 Procesando productor: $nombreNegocio..."

    # 1. Intentar Registrar
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"role\": \"PRODUCTOR\",
            \"nombre\": \"$nombre\",
            \"telefono\": \"$telefono\",
            \"direccion\": \"$direccion\",
            \"nombreNegocio\": \"$nombreNegocio\",
            \"descripcion\": \"$descripcion\"
        }")

    HTTP_BODY=$(echo "$RESPONSE" | head -n1)
    HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
    TOKEN=""

    if [ "$HTTP_STATUS" -eq 201 ]; then
        echo -e "${GREEN}✅ Registrado exitosamente${NC}"
        TOKEN=$(echo "$HTTP_BODY" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    elif [ "$HTTP_STATUS" -eq 409 ]; then
        echo "⚠️ Usuario ya existe, intentando login..."
        LOGIN_RES=$(curl -s -X POST "$API_URL/auth/login" \
            -H "Content-Type: application/json" \
            -d "{
                \"email\": \"$email\",
                \"password\": \"$password\"
            }")
        TOKEN=$(echo "$LOGIN_RES" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
        if [ -n "$TOKEN" ]; then
             echo -e "${GREEN}✅ Login exitoso${NC}"
        else
             echo -e "${RED}❌ Error en login${NC}"
             return
        fi
    else
        echo -e "${RED}❌ Error en registro: $HTTP_BODY${NC}"
        return
    fi

    # 2. Crear Productos
    echo "📦 Creando productos..."
    
    create_product "$TOKEN" "Manzanas Fuji - $nombreNegocio" 1500 "kg" "frutas" "Manzanas dulces"
    create_product "$TOKEN" "Lechuga Hidro - $nombreNegocio" 1000 "unidad" "verduras" "Lechuga fresca"
    create_product "$TOKEN" "Tomate Limachino - $nombreNegocio" 2000 "kg" "verduras" "Tomate sabroso"
    create_product "$TOKEN" "Queso Fresco - $nombreNegocio" 3500 "unidad" "lacteos" "Queso artesanal"
    create_product "$TOKEN" "Miel de Ulmo - $nombreNegocio" 5000 "unidad" "despensa" "Miel natural"
}

create_product() {
    local token=$1
    local nombre=$2
    local precio=$3
    local unidad=$4
    local categoria=$5
    local descripcion=$6
    local stock=$((10 + RANDOM % 50))

    curl -s -o /dev/null -X POST "$API_URL/producto" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{
            \"nombre\": \"$nombre\",
            \"precio\": $precio,
            \"unidad\": \"$unidad\",
            \"categoria\": \"$categoria\",
            \"descripcion\": \"$descripcion\",
            \"stock\": $stock,
            \"disponible\": true
        }"
    
    echo "  - Producto creado: $nombre"
}

# Ejecutar para 3 productores
process_producer "productor1@example.com" "password123" "Juan Perez" "Frutos del Valle" "+56911111111" "Valparaiso" "Frutas frescas"
process_producer "productor2@example.com" "password123" "Maria Gonzalez" "Hortalizas Maria" "+56922222222" "Curacavi" "Verduras organicas"
process_producer "productor3@example.com" "password123" "Pedro Soto" "Quesos del Campo" "+56933333333" "Melipilla" "Quesos artesanales"

echo -e "\n✨ Proceso finalizado."
