import requests
import json
import random

API_URL = 'https://saborloca-api.onrender.com'

productores = [
    {
        'email': 'productor1@example.com',
        'password': 'password123',
        'role': 'PRODUCTOR',
        'nombre': 'Juan Perez',
        'telefono': '+56911111111',
        'direccion': 'Fundo El Roble, Valparaíso',
        'nombreNegocio': 'Frutos del Valle',
        'descripcion': 'Frutas frescas de temporada',
    },
    {
        'email': 'productor2@example.com',
        'password': 'password123',
        'role': 'PRODUCTOR',
        'nombre': 'Maria Gonzalez',
        'telefono': '+56922222222',
        'direccion': 'Parcela 5, Curacaví',
        'nombreNegocio': 'Hortalizas Maria',
        'descripcion': 'Verduras orgánicas sin pesticidas',
    },
    {
        'email': 'productor3@example.com',
        'password': 'password123',
        'role': 'PRODUCTOR',
        'nombre': 'Pedro Soto',
        'telefono': '+56933333333',
        'direccion': 'Camino Real 123, Melipilla',
        'nombreNegocio': 'Quesos del Campo',
        'descripcion': 'Quesos artesanales de vaca y cabra',
    },
]

productos_base = [
    {'nombre': 'Manzanas Fuji', 'precio': 1500, 'unidad': 'kg', 'categoria': 'frutas', 'descripcion': 'Manzanas dulces y crujientes'},
    {'nombre': 'Lechuga Hidropónica', 'precio': 1000, 'unidad': 'unidad', 'categoria': 'verduras', 'descripcion': 'Lechuga fresca lista para comer'},
    {'nombre': 'Tomate Limachino', 'precio': 2000, 'unidad': 'kg', 'categoria': 'verduras', 'descripcion': 'El verdadero sabor del tomate'},
    {'nombre': 'Queso Fresco', 'precio': 3500, 'unidad': 'unidad', 'categoria': 'lacteos', 'descripcion': 'Queso fresco artesanal 500g'},
    {'nombre': 'Miel de Ulmo', 'precio': 5000, 'unidad': 'unidad', 'categoria': 'despensa', 'descripcion': 'Miel 100% natural 1kg'},
]

def populate():
    print('🚀 Iniciando población de base de datos...')

    for prod_data in productores:
        try:
            print(f"\n👤 Registrando productor: {prod_data['nombreNegocio']}...")
            
            # 1. Registrar o Login
            token = None
            try:
                register_res = requests.post(f"{API_URL}/auth/register", json=prod_data)
                register_res.raise_for_status()
                token = register_res.json()['data']['access_token']
                print('✅ Registrado exitosamente')
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 409:
                    print('⚠️ Usuario ya existe, intentando login...')
                    login_res = requests.post(f"{API_URL}/auth/login", json={
                        'email': prod_data['email'],
                        'password': prod_data['password'],
                    })
                    login_res.raise_for_status()
                    token = login_res.json()['data']['access_token']
                    print('✅ Login exitoso')
                else:
                    raise e

            # 2. Crear Productos
            print(f"📦 Creando productos para {prod_data['nombreNegocio']}...")
            headers = {'Authorization': f"Bearer {token}"}

            for i in range(5):
                base_prod = productos_base[i]
                producto = base_prod.copy()
                producto['nombre'] = f"{base_prod['nombre']} - {prod_data['nombreNegocio']}"
                producto['stock'] = random.randint(10, 60)
                producto['disponible'] = True

                try:
                    prod_res = requests.post(f"{API_URL}/producto", json=producto, headers=headers)
                    prod_res.raise_for_status()
                    print(f"  - Producto creado: {producto['nombre']}")
                except requests.exceptions.RequestException as e:
                    error_msg = e.response.text if e.response else str(e)
                    print(f"  ❌ Error creando producto {producto['nombre']}: {error_msg}")

        except requests.exceptions.RequestException as e:
            error_msg = e.response.text if e.response else str(e)
            print(f"❌ Error procesando productor {prod_data['email']}: {error_msg}")

    print('\n✨ Proceso finalizado.')

if __name__ == '__main__':
    populate()
