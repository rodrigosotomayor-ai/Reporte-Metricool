# Reporte de Redes Sociales — Match Agency
## Proxy Metricool + Presentación HTML

---

## Deploy en Vercel (5 minutos)

### 1. Sube el proyecto a GitHub
Crea un repositorio nuevo en GitHub y sube esta carpeta completa.

### 2. Importa en Vercel
1. Ve a [vercel.com](https://vercel.com) → New Project
2. Importa el repositorio que acabas de crear
3. Deja todo por defecto y haz clic en **Deploy**

### 3. Agrega las variables de entorno
En Vercel → Settings → Environment Variables, agrega:

| Variable | Valor |
|----------|-------|
| `MC_TOKEN` | Tu token de Metricool |
| `MC_USER_ID` | Tu User ID de Metricool |
| `MC_BLOG_ID` | Tu Blog ID de Metricool |

Luego haz **Redeploy** para que tomen efecto.

### 4. Abre el reporte
Una vez deployado, Vercel te da una URL del tipo:
```
https://metricool-proxy-match.vercel.app
```

Esa URL es donde vive tu reporte. Ábrela en el navegador.

---

## Uso mensual

1. Abre la URL de tu proyecto en Vercel
2. Selecciona el mes del reporte
3. Selecciona la red social
4. El campo "URL del proxy" ya viene pre-llenado con la URL del mismo proyecto
5. Haz clic en **Generar reporte**

---

## Estructura del proyecto

```
metricool-proxy/
├── api/
│   └── metricool.js     ← Proxy serverless (hace las llamadas a Metricool)
├── public/
│   └── index.html       ← Presentación HTML completa
├── vercel.json          ← Configuración de rutas
└── package.json
```

---

## Credenciales Metricool

Encuéntralas en: **Metricool → Ajustes de cuenta → API**
- User Token → `X-Mc-Auth`
- User ID y Blog ID → parámetros de cada llamada
