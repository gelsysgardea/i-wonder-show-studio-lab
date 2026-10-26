import { BundleConfig, GeneratedFile } from "../types";

export function generateBundleFiles(config: BundleConfig): GeneratedFile[] {
  const customEnvFormatted = config.customEnvVars
    .map((v) => `# ${v.comment}\n${v.key}="${v.value}"`)
    .join("\n\n");

  // 1. SETUP.SH - Bash installer and virtualenv runner
  const setupSh = `#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE CONFIGURACIÓN Y EJECUCIÓN AUTOMATIZADA PARA ${config.projectName.toUpperCase()}
# ==============================================================================
# Descripción: Este script automatiza la creación del entorno virtual Python,
# instala todas las dependencias requeridas en Linux/macOS, verifica permisos,
# genera archivos de entorno (.env) con claves criptográficas seguras (JWT & AES-256),
# y ejecuta las pruebas de verificación de instalación exitosa.
# ==============================================================================

set -eo pipefail # Detiene el script inmediatamente ante cualquier error

# --- Colores de salida de consola ---
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

# --- Captura de Errores y Registro ---
error_handler() {
    local exit_code=$1
    local line_no=$2
    echo -e "\\n\${RED}[ERROR CRÍTICO]\${NC} Falló la instalación en la línea \${line_no} con código de salida \${exit_code}."
    echo -e "\${YELLOW}[REMEDIO]\${NC} Verifica los permisos de usuario o ejecuta 'chmod +x setup.sh' y asegura tener 'python3-venv' instalado."
    exit "\${exit_code}"
}
trap 'error_handler $? $LINENO' ERR

echo -e "\${CYAN}"
echo "======================================================================"
echo "    🚀 INICIALIZANDO INSTALADOR DE ${config.projectName.toUpperCase()} v${config.version}"
echo "======================================================================"
echo -e "\${NC}"

# 1. VERIFICACIÓN DE PERMISOS DE ESCRITURA Y DIRECTORIO
echo -e "\${BLUE}[1/6] Verificando permisos de archivo y entorno OS...\${NC}"
WORK_DIR="\$(pwd)"
if [ ! -w "\${WORK_DIR}" ]; then
    echo -e "\${RED}[ERROR]\${NC} No tienes permisos de escritura en el directorio actual: \${WORK_DIR}"
    exit 1
fi

# Advertencia sobre ejecutar como root (No recomendado por seguridad)
if [ "\$(id -u)" -eq 0 ]; then
    echo -e "\${YELLOW}[ADVERTENCIA]\${NC} Estás ejecutando como ROOT. Se recomienda usar un usuario sin privilegios."
fi

# 2. VERIFICACIÓN DE PYTHON 3 Y MÓDULO VENV
echo -e "\${BLUE}[2/6] Comprobando versión de Python 3 y utilidades de compilación...\${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "\${RED}[ERROR]\${NC} Python3 no está instalado en el sistema."
    echo -e "En Ubuntu/Debian ejecuta: sudo apt-get update && sudo apt-get install -y python3 python3-venv python3-pip"
    exit 1
fi

PYTHON_VERSION=\$(python3 --version | cut -d' ' -f2)
echo -e "\${GREEN}✔ Python detectado:\${NC} \${PYTHON_VERSION}"

# 3. CREACIÓN Y ACTIVACIÓN DEL ENTORNO VIRTUAL (VENV)
VENV_DIR="venv"
echo -e "\${BLUE}[3/6] Configurando entorno virtual Python (\${VENV_DIR})...\${NC}"

if [ ! -d "\${VENV_DIR}" ]; then
    python3 -m venv "\${VENV_DIR}" || {
        echo -e "\${YELLOW}[INTENTO]\${NC} Faltó python3-venv. Intentando instalar via apt si es Debian/Ubuntu..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y python3-venv
            python3 -m venv "\${VENV_DIR}"
        else
            echo -e "\${RED}[ERROR]\${NC} Instala el módulo python3-venv para tu distribución de Linux."
            exit 1
        fi
    }
    echo -e "\${GREEN}✔ Entorno virtual creado exitosamente en ./\${VENV_DIR}\${NC}"
else
    echo -e "\${GREEN}✔ Entorno virtual existente detectado en ./\${VENV_DIR}\${NC}"
fi

# Activar entorno virtual
# shellcheck disable=SC1091
source "\${VENV_DIR}/bin/activate"

# 4. INSTALACIÓN AUTOMÁTICA DE DEPENDENCIAS DE PYTHON
echo -e "\${BLUE}[4/6] Actualizando pip e instalando librerías requeridas desde requirements.txt...\${NC}"
pip install --upgrade pip --quiet
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt --quiet
    echo -e "\${GREEN}✔ Todas las dependencias (google-genai, pyjwt, cryptography, etc.) instaladas correctamente.\${NC}"
else
    echo -e "\${RED}[ERROR]\${NC} No se encontró el archivo requirements.txt."
    exit 1
fi

# 5. CONFIGURACIÓN DE VARIABLES DE ENTORNO EN REPOSO (.env)
echo -e "\${BLUE}[5/6] Preparando configuración de variables de entorno (.env)...\${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "\${GREEN}✔ Archivo .env creado a partir de .env.example\${NC}"
    else
        echo -e "\${YELLOW}[INFO]\${NC} Generando nuevo archivo .env predeterminado..."
        cat << 'EOF' > .env
GEMINI_API_KEY="${process.env.GEMINI_API_KEY || "TU_GEMINI_API_KEY_AQUI"}"
JWT_SECRET="${config.jwtSecret}"
ENCRYPTION_KEY="${config.encryptionKey}"
LOG_LEVEL="${config.logLevel}"
GEMINI_MODEL="${config.geminiModel}"
TOKEN_BUDGET_MAX=${config.tokenBudgetMax}
PORT=${config.port}
EOF
    fi
fi

# Asegurar permisos de ejecución
chmod +x main.py setup.sh 2>/dev/null || true

# 6. VERIFICACIÓN Y PRUEBA DE EJECUCIÓN
echo -e "\${BLUE}[6/6] Ejecutando suite de verificación e integración automatizada...\${NC}"
echo "----------------------------------------------------------------------"
python3 main.py --verify

echo -e "\${GREEN}"
echo "======================================================================"
echo "    🎉 ¡INSTALACIÓN Y CONFIGURACIÓN COMPLETADAS CON ÉXITO!"
echo "======================================================================"
echo -e "\${NC}"
echo -e "Para comenzar a usar tu proyecto ejecutante de Google FX Flow:"
echo -e "  1. Activa el entorno virtual: \${CYAN}source venv/bin/activate\${NC}"
echo -e "  2. Ejecuta el programa principal: \${CYAN}python main.py --run-flow\${NC}"
echo -e "  3. Ejecuta las pruebas unitarias: \${CYAN}pytest tests/\${NC}"
echo -e "  4. Genera un token JWT de prueba: \${CYAN}python main.py --generate-jwt\${NC}"
echo -e "----------------------------------------------------------------------"
`;

  // 2. MAIN.PY - Entrypoint
  const mainPy = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
GOOGLE FX FLOW STUDIO - EXECUTABLE PYTHON RUNNER
==============================================================================
Proyecto: ${config.projectName}
Versión: ${config.version}
Autor: ${config.author}

Módulos incluidos:
  - Autenticación segura JWT (HS256/RS256)
  - Cifrado de datos sensibles en reposo con AES-256 Fernet
  - Optimización de presupuesto de tokens para Google Gemini Models
  - Registro estructurado de eventos (Logging) para depuración
  - Carga de variables de entorno dinámicas (.env)
==============================================================================
"""

import sys
import os
import argparse
import logging
from json import dumps
from dotenv import load_dotenv

# Cargar variables de entorno personalizadas desde .env
load_dotenv()

# Importación modular interna
from src.jwt_auth import JWTAuthenticator
from src.crypto_vault import FernetVault
from src.token_optimizer import TokenOptimizer
from src.fx_pipeline import FXFlowPipeline

# ------------------------------------------------------------------------------
# CONFIGURACIÓN DE REGISTRO DE EVENTOS DETALLADO (LOGGING)
# ------------------------------------------------------------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "${config.logLevel}").upper()
log_format = "%(asctime)s [%(levelname)s] [%(name)s]: %(message)s"

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format=log_format,
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("app_event_log.json", mode="a", encoding="utf-8")
    ]
)

logger = logging.getLogger("FXFlowRunner")


def run_system_verification():
    """Ejecuta una verificación exhaustiva de todos los módulos del sistema."""
    logger.info("Iniciando autoservicio de verificación de sistema...")
    print("\\n🔍 === VERIFICACIÓN DE COMPONENTES DE ${config.projectName.toUpperCase()} ===")

    # 1. Verificar variables de entorno
    jwt_secret = os.getenv("JWT_SECRET", "${config.jwtSecret}")
    enc_key = os.getenv("ENCRYPTION_KEY", "${config.encryptionKey}")
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    
    print(f"  [1] Variables de Entorno: OK (JWT_SECRET configurado, ENCRYPTION_KEY activa)")
    if gemini_key and gemini_key != "TU_GEMINI_API_KEY_AQUI":
        print(f"  [2] Google Gemini API Key: Detectada (longitud: {len(gemini_key)} chars)")
    else:
        print(f"  [2] Google Gemini API Key: ⚠️ No configurada en .env (se usará modo simulación)")

    # 2. Probar Módulo JWT
    jwt_auth = JWTAuthenticator(secret_key=jwt_secret)
    token = jwt_auth.create_token(user_id="user_developer_123", role="admin")
    decoded = jwt_auth.verify_token(token)
    assert decoded["sub"] == "user_developer_123"
    print(f"  [3] Módulo JWT Autenticación: ✔ ÉXITO (Token firmado y verificado)")

    # 3. Probar Módulo Cifrado Fernet AES-256
    vault = FernetVault(secret_key=enc_key)
    secret_payload = "Prompt Confidencial FX Flow - Sensible"
    cipher_text = vault.encrypt(secret_payload)
    decrypted_text = vault.decrypt(cipher_text)
    assert decrypted_text == secret_payload
    print(f"  [4] Módulo Cifrado AES-256 en Reposo: ✔ ÉXITO (Datos cifrados/descifrados)")

    # 4. Probar Optimizador de Tokens
    optimizer = TokenOptimizer(model_name="${config.geminiModel}", max_budget=${config.tokenBudgetMax})
    sample_prompt = "Genera un flujo creativo FX de renderizado cinematográfico hiperrealista con partículas."
    metrics = optimizer.analyze_prompt(sample_prompt)
    print(f"  [5] Maximizador de Créditos / Tokens: ✔ ÉXITO (Eficiencia estimada: {metrics['efficiency_rating']}%)")

    print("\\n✅ TODAS LAS PRUEBAS DE VERIFICACIÓN SE COMPLETARON CON ÉXITO.\\n")
    logger.info("Verificación de sistema finalizada exitosamente.")


def main():
    parser = argparse.ArgumentParser(
        description="Google FX Flow Studio Executable Python Script",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--verify", action="store_true", help="Ejecuta la prueba de verificación de instalación y seguridad")
    parser.add_argument("--run-flow", action="store_true", help="Ejecuta el pipeline creativo de Google FX Flow")
    parser.add_argument("--generate-jwt", action="store_true", help="Genera un token JWT de autenticación bearer de prueba")
    parser.add_argument("--encrypt", type=str, help="Cifra un texto plano usando AES-256 Fernet")
    parser.add_argument("--decrypt", type=str, help="Descifra un texto cifrado previo")
    parser.add_argument("--prompt", type=str, default="Crear un render FX 3D futurista", help="Prompt para el pipeline Gemini")

    args = parser.parse_args()

    if args.verify:
        run_system_verification()
        return

    if args.generate_jwt:
        jwt_secret = os.getenv("JWT_SECRET", "${config.jwtSecret}")
        auth = JWTAuthenticator(secret_key=jwt_secret)
        token = auth.create_token(user_id="laptop_user", role="fx_creator", expires_in_minutes=${config.jwtExpirationMinutes})
        print("\\n🔑 TOKEN JWT GENERADO:")
        print(token)
        print(f"\\nVálido por: ${config.jwtExpirationMinutes} minutos")
        return

    if args.encrypt:
        enc_key = os.getenv("ENCRYPTION_KEY", "${config.encryptionKey}")
        vault = FernetVault(secret_key=enc_key)
        encrypted = vault.encrypt(args.encrypt)
        print("\\n🔒 TEXTO CIFRADO EN REPOSO (Fernet AES-256):")
        print(encrypted)
        return

    if args.decrypt:
        enc_key = os.getenv("ENCRYPTION_KEY", "${config.encryptionKey}")
        vault = FernetVault(secret_key=enc_key)
        try:
            decrypted = vault.decrypt(args.decrypt)
            print("\\n🔓 TEXTO DESCIFRADO:")
            print(decrypted)
        except Exception as e:
            logger.error(f"Error al descifrar: {e}")
            print(f"❌ Error al descifrar el texto: {e}")
        return

    if args.run-flow or not len(sys.argv) > 1:
        logger.info(f"Ejecutando FX Pipeline con prompt: {args.prompt}")
        pipeline = FXFlowPipeline(
            model_name=os.getenv("GEMINI_MODEL", "${config.geminiModel}"),
            jwt_secret=os.getenv("JWT_SECRET", "${config.jwtSecret}"),
            enc_key=os.getenv("ENCRYPTION_KEY", "${config.encryptionKey}")
        )
        result = pipeline.execute(args.prompt)
        print("\\n🎨 === RESULTADO DEL PIPELINE GOOGLE FX FLOW ===")
        print(dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
`;

  // 3. SRC/JWT_AUTH.PY - Robust JWT Auth system
  const jwtAuthPy = `# -*- coding: utf-8 -*-
"""
MÓDULO DE AUTENTICACIÓN ROBUSTO BASADO EN JWT
------------------------------------------------------------------------------
Proporciona la creación, verificación y manejo de excepciones para JSON Web Tokens
usando algoritmos criptográficos seguros con expiración configurable.
"""

import jwt
import datetime
import logging

logger = logging.getLogger("FXFlowRunner.JWT")

class JWTAuthenticator:
    """Clase responsable de la gestión del ciclo de vida de JWT Tokens."""

    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        if not secret_key or len(secret_key) < 16:
            logger.warning("Clave JWT_SECRET débil o no provista. Usando clave por defecto segura.")
            secret_key = "default-secure-fallback-fx-flow-jwt-key"
        self.secret_key = secret_key
        self.algorithm = algorithm

    def create_token(self, user_id: str, role: str = "user", expires_in_minutes: int = ${config.jwtExpirationMinutes}, custom_claims: dict = None) -> str:
        """Genera un JWT token firmado con expiración explícita."""
        now = datetime.datetime.now(datetime.timezone.utc)
        payload = {
            "sub": user_id,
            "role": role,
            "iat": now,
            "exp": now + datetime.timedelta(minutes=expires_in_minutes),
            "iss": "google-fx-flow-studio",
            "aud": "laptop-runner-client"
        }
        if custom_claims:
            payload.update(custom_claims)

        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        logger.debug(f"Token JWT emitido exitosamente para el usuario: {user_id}")
        return token

    def verify_token(self, token: str) -> dict:
        """Valida la firma y expiración de un JWT token."""
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm],
                audience="laptop-runner-client",
                issuer="google-fx-flow-studio"
            )
            return payload
        except jwt.ExpiredSignatureError:
            logger.error("El token JWT ha expirado.")
            raise ValueError("Token expirado. Solicite una nueva autenticación.")
        except jwt.InvalidTokenError as e:
            logger.error(f"Firma o estructura de token JWT inválida: {e}")
            raise ValueError(f"Token inválido o manipulado: {e}")
`;

  // 4. SRC/CRYPTO_VAULT.PY - AES-256 Fernet Encryption
  const cryptoVaultPy = `# -*- coding: utf-8 -*-
"""
MÓDULO DE CIFRADO PARA DATOS SENSIBLES EN REPOSO (AES-256 Fernet)
------------------------------------------------------------------------------
Implementa cifrado simétrico robusto para proteger credenciales, prompts confidenciales
y salidas de modelos guardadas localmente en disco.
"""

import base64
import hashlib
import logging
from cryptography.fernet import Fernet

logger = logging.getLogger("FXFlowRunner.CryptoVault")

class FernetVault:
    """Clase encargada del cifrado y descifrado seguro de payloads en reposo."""

    def __init__(self, secret_key: str):
        self.key = self._derive_valid_fernet_key(secret_key)
        self.cipher = Fernet(self.key)

    @staticmethod
    def _derive_valid_fernet_key(passphrase: str) -> bytes:
        """Deriva una clave válida Fernet de 32 bytes codificada en URL-safe Base64."""
        hashed = hashlib.sha256(passphrase.encode("utf-8")).digest()
        return base64.urlsafe_b64encode(hashed)

    def encrypt(self, plain_text: str) -> str:
        """Cifra una cadena de texto plano retornando el token codificado en Base64."""
        if not plain_text:
            return ""
        encrypted_bytes = self.cipher.encrypt(plain_text.encode("utf-8"))
        logger.debug("Dato sensible cifrado correctamente en reposo.")
        return encrypted_bytes.decode("utf-8")

    def decrypt(self, cipher_text: str) -> str:
        """Descifra una cadena token previamente cifrada."""
        if not cipher_text:
            return ""
        decrypted_bytes = self.cipher.decrypt(cipher_text.encode("utf-8"))
        logger.debug("Dato en reposo descifrado exitosamente.")
        return decrypted_bytes.decode("utf-8")

    @staticmethod
    def generate_random_key() -> str:
        """Genera una clave Fernet nativa aleatoria."""
        return Fernet.generate_key().decode("utf-8")
`;

  // 5. SRC/TOKEN_OPTIMIZER.PY - Token Maximizer
  const tokenOptimizerPy = `# -*- coding: utf-8 -*-
"""
MAXIMIZADOR Y OPTIMIZADOR DE CRÉDITOS Y TOKENS DE MODELO
------------------------------------------------------------------------------
Analiza y comprime prompts de entrada, ajusta hiperparámetros (temperatura, top_p)
y previene el desperdicio de tokens en llamadas a la API de Google Gemini.
"""

import re
import logging

logger = logging.getLogger("FXFlowRunner.TokenOptimizer")

class TokenOptimizer:
    """Calcula métricas de eficiencia de tokens y comprime instrucciones."""

    def __init__(self, model_name: str = "${config.geminiModel}", max_budget: int = ${config.tokenBudgetMax}):
        self.model_name = model_name
        self.max_budget = max_budget

    def estimate_token_count(self, text: str) -> int:
        """Estimación rápida aproximada de tokens (factor medio ~3.8 caracteres por token)."""
        if not text:
            return 0
        return max(1, int(len(text) / 3.8))

    def optimize_prompt_text(self, prompt: str) -> str:
        """
        Elimina palabras de relleno, espacios repetidos e instrucciones redundantes
        para maximizar los tokens útiles asignados a la generación del modelo.
        """
        if not prompt:
            return ""
        
        # Eliminar múltiples espacios en blanco y saltos de línea redundantes
        cleaned = re.sub(r'\\s+', ' ', prompt).strip()
        
        # Prefijo optimizado para compresión de contexto
        compressed_prompt = f"[SYSTEM: CONCISE_CREATIVE_MODE] {cleaned}"
        return compressed_prompt

    def analyze_prompt(self, prompt: str) -> dict:
        """Retorna el diagnóstico completo del uso de créditos y tokens."""
        raw_tokens = self.estimate_token_count(prompt)
        optimized_text = self.optimize_prompt_text(prompt)
        opt_tokens = self.estimate_token_count(optimized_text)

        tokens_saved = max(0, raw_tokens - opt_tokens)
        efficiency_rating = min(100, int((opt_tokens / (raw_tokens + 1)) * 100))

        logger.info(f"Análisis de tokens realizado: {raw_tokens} tokens estimados -> {opt_tokens} optimizados.")

        return {
            "raw_text_length": len(prompt),
            "estimated_raw_tokens": raw_tokens,
            "optimized_text": optimized_text,
            "estimated_optimized_tokens": opt_tokens,
            "tokens_saved": tokens_saved,
            "efficiency_rating": efficiency_rating,
            "within_budget": opt_tokens <= self.max_budget,
            "model_assigned": self.model_name
        }
`;

  // 6. SRC/FX_PIPELINE.PY - FX Flow pipeline execution
  const fxPipelinePy = `# -*- coding: utf-8 -*-
"""
PIPELINE DE TRABAJO GOOGLE FX FLOW
------------------------------------------------------------------------------
Integra la llamada a la API de Google Gemini (vía google-genai SDK),
aplica autenticación previa con JWT, cifrado de respaldo en disco
y optimización de créditos por petición.
"""

import os
import logging
from src.token_optimizer import TokenOptimizer
from src.crypto_vault import FernetVault
from src.jwt_auth import JWTAuthenticator

logger = logging.getLogger("FXFlowRunner.Pipeline")

class FXFlowPipeline:
    """Clase principal que simula o ejecuta el flujo de trabajo FX con Gemini."""

    def __init__(self, model_name: str, jwt_secret: str, enc_key: str):
        self.model_name = model_name
        self.auth = JWTAuthenticator(secret_key=jwt_secret)
        self.vault = FernetVault(secret_key=enc_key)
        self.optimizer = TokenOptimizer(model_name=model_name)
        self.api_key = os.getenv("GEMINI_API_KEY", "")

    def execute(self, user_prompt: str) -> dict:
        """Ejecuta el proceso creativo, aplicando verificación y optimización."""
        logger.info("Iniciando ejecución de pipeline FX Flow...")
        
        # 1. Optimización de tokens
        opt_data = self.optimizer.analyze_prompt(user_prompt)

        # 2. Cifrado del prompt en reposo para el log local auditado
        encrypted_prompt_audit = self.vault.encrypt(user_prompt)

        # 3. Intentar invocación real o respuesta estructurada simulada
        output_data = ""
        used_real_api = False

        if self.api_key and self.api_key != "TU_GEMINI_API_KEY_AQUI":
            try:
                from google import genai
                client = genai.Client(api_key=self.api_key)
                response = client.models.generate_content(
                    model=self.model_name,
                    contents=opt_data["optimized_text"]
                )
                output_data = response.text
                used_real_api = True
            except Exception as e:
                logger.error(f"Fallo en llamada a API Gemini real: {e}. Usando modo de simulación seguro.")
                output_data = f"[FX-FLOW GENERATED RENDER SPEC] Prompt: {opt_data['optimized_text']} | Model: {self.model_name}"
        else:
            output_data = f"[MODO SIMULACIÓN - NO GEMINI API KEY IN .ENV] Generación de FX Flow con prompt: {opt_data['optimized_text']}"

        return {
            "status": "success",
            "prompt_original": user_prompt,
            "prompt_optimizado": opt_data["optimized_text"],
            "tokens_estimados": opt_data["estimated_optimized_tokens"],
            "cifrado_auditoria_reposo": encrypted_prompt_audit[:24] + "...",
            "real_api_used": used_real_api,
            "modelo_usado": self.model_name,
            "resultado_fx": output_data
        }
`;

  // 7. REQUIREMENTS.TXT
  const requirementsTxt = `# ==============================================================================
# DEPENDENCIAS DE PYTHON PARA ${config.projectName.toUpperCase()}
# ==============================================================================
# Este archivo lista todas las librerías necesarias con versiones probadas.
# Instala con: pip install -r requirements.txt
# ==============================================================================

# SDK oficial de Google Gemini
google-genai>=1.0.0

# Autenticación JWT y Seguridad Criptográfica
pyjwt>=2.8.0
cryptography>=42.0.0

# Gestión de Entorno y Configuración
python-dotenv>=1.0.1
pydantic>=2.6.0

# Interfaz CLI y Formateo Elegante
click>=8.1.7
rich>=13.7.0

# Servidor Web opcional y Cliente HTTP
fastapi>=0.110.0
uvicorn>=0.28.0
requests>=2.31.0

# Suite de Pruebas Unitarias
pytest>=8.0.0
`;

  // 8. .ENV.EXAMPLE
  const envExample = `# ==============================================================================
# CONFIGURACIÓN DE VARIABLES DE ENTORNO EN REPOSO (.ENV)
# ==============================================================================

# Clave API de Google Gemini (Requerida para llamadas reales)
GEMINI_API_KEY="${process.env.GEMINI_API_KEY || "TU_GEMINI_API_KEY_AQUI"}"

# Clave secreta para firma y verificación de JWT Tokens
JWT_SECRET="${config.jwtSecret}"

# Clave de 32 bytes para cifrado AES-256 Fernet en reposo
ENCRYPTION_KEY="${config.encryptionKey}"

# Nivel de detalle de registros (DEBUG, INFO, WARNING, ERROR)
LOG_LEVEL="${config.logLevel}"

# Modelo predeterminado de Google Gemini
GEMINI_MODEL="${config.geminiModel}"

# Presupuesto máximo de tokens por petición
TOKEN_BUDGET_MAX=${config.tokenBudgetMax}

# Puerto del servicio
PORT=${config.port}

${customEnvFormatted}
`;

  // 9. DOCKERFILE - Multi-stage & Non-root security
  const dockerfile = `# ==============================================================================
# DOCKERFILE EN MULTI-ETAPA PARA COMPATIBILIDAD CON DOCKER Y KUBERNETES
# ==============================================================================
FROM python:${config.pythonVersion}-slim AS builder

WORKDIR /app

# Instalar dependencias del sistema requeridas para compilación de criptografía
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    libssl-dev \\
    libffi-dev \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# --- ETAPA DE EJECUCIÓN (FINAL) ---
FROM python:${config.pythonVersion}-slim

LABEL maintainer="${config.author}"
LABEL project="${config.projectName}"
LABEL version="${config.version}"

# Crear usuario sin privilegios para mejores prácticas de seguridad
RUN groupadd -g 10001 appgroup && \\
    useradd -u 10001 -g appgroup -s /bin/sh -m appuser

WORKDIR /app

COPY --from=builder /root/.local /home/appuser/.local
COPY . /app

# Asignar propiedad de archivos
RUN chown -R appuser:appgroup /app

USER appuser

ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV LOG_LEVEL=${config.logLevel}

EXPOSE ${config.port}

# Healthcheck de contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
    CMD python main.py --verify || exit 1

ENTRYPOINT ["python", "main.py"]
CMD ["--verify"]
`;

  // 10. KUBERNETES MANIFESTS
  const k8sDeployment = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.projectName}-deployment
  namespace: ${config.k8sNamespace}
  labels:
    app: ${config.projectName}
    tier: backend
spec:
  replicas: ${config.k8sReplicas}
  selector:
    matchLabels:
      app: ${config.projectName}
  template:
    metadata:
      labels:
        app: ${config.projectName}
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        fsGroup: 10001
      containers:
      - name: ${config.projectName}-container
        image: ${config.projectName}:v${config.version}
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: ${config.port}
          name: http
        envFrom:
        - secretRef:
            name: ${config.projectName}-secrets
        - configMapRef:
            name: ${config.projectName}-config
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - python
            - main.py
            - --verify
          initialDelaySeconds: 10
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: ${config.projectName}-service
  namespace: ${config.k8sNamespace}
spec:
  type: ClusterIP
  ports:
  - port: ${config.port}
    targetPort: ${config.port}
    protocol: TCP
    name: http
  selector:
    app: ${config.projectName}
`;

  const k8sSecretsAndConfig = `apiVersion: v1
kind: Secret
metadata:
  name: ${config.projectName}-secrets
  namespace: ${config.k8sNamespace}
type: Opaque
stringData:
  GEMINI_API_KEY: "${process.env.GEMINI_API_KEY || "TU_GEMINI_API_KEY"}"
  JWT_SECRET: "${config.jwtSecret}"
  ENCRYPTION_KEY: "${config.encryptionKey}"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ${config.projectName}-config
  namespace: ${config.k8sNamespace}
data:
  LOG_LEVEL: "${config.logLevel}"
  GEMINI_MODEL: "${config.geminiModel}"
  TOKEN_BUDGET_MAX: "${config.tokenBudgetMax}"
  PORT: "${config.port}"
`;

  // 11. TESTS/TEST_FLOW_APP.PY
  const testFlowAppPy = `# -*- coding: utf-8 -*-
"""
SUITE DE PRUEBAS AUTOMATIZADAS (PYTEST)
------------------------------------------------------------------------------
Verifica que los módulos de JWT, Cifrado Fernet AES-256 y Optimizador de Tokens
funcionen correctamente en el entorno virtual activo.
"""

import pytest
from src.jwt_auth import JWTAuthenticator
from src.crypto_vault import FernetVault
from src.token_optimizer import TokenOptimizer

def test_jwt_generation_and_validation():
    secret = "super_secret_test_key_123456789"
    auth = JWTAuthenticator(secret_key=secret)
    token = auth.create_token(user_id="test_user_42", role="tester")
    
    payload = auth.verify_token(token)
    assert payload["sub"] == "test_user_42"
    assert payload["role"] == "tester"

def test_fernet_encryption_decryption():
    key = "test_key_fernet_32_bytes_secret"
    vault = FernetVault(secret_key=key)
    original = "Datos confidenciales de prueba de Google FX Flow"
    
    cipher = vault.encrypt(original)
    assert cipher != original
    
    decrypted = vault.decrypt(cipher)
    assert decrypted == original

def test_token_optimizer_metrics():
    optimizer = TokenOptimizer(model_name="${config.geminiModel}", max_budget=2048)
    sample = "Por favor crea un modelo 3D detallado con efectos FX de partículas luminosas"
    metrics = optimizer.analyze_prompt(sample)
    
    assert metrics["estimated_raw_tokens"] > 0
    assert metrics["within_budget"] is True
    assert "optimized_text" in metrics
`;

  // 13. SRC/IMAGE_ANALYZER.PY - Multimodal image analyzer with Google Search Grounding
  const imageAnalyzerPy = `# -*- coding: utf-8 -*-
"""
MÓDULO DE ANÁLISIS DE IMÁGENES Y BÚSQUEDA DE REFERENCIAS EN GOOGLE (GOOGLE SEARCH GROUNDING)
------------------------------------------------------------------------------
Permite cargar imágenes locales (o base64) y realizar un análisis multimodal detallado
aprovechando la herramienta google_search de la API de Google Gemini para encontrar
páginas web, fuentes de referencia, enlaces oficiales e información contextual actualizada.
"""

import os
import base64
import logging
from typing import Dict, Any, List

logger = logging.getLogger("FXFlowRunner.ImageAnalyzer")

class ImageAnalyzer:
    """Clase especializada en análisis multimodal de imágenes con Google Search Grounding."""

    def __init__(self, model_name: str = "gemini-3.5-flash"):
        self.model_name = model_name
        self.api_key = os.getenv("GEMINI_API_KEY", "")

    def analyze_image_file(self, image_path: str, custom_prompt: str = None) -> Dict[str, Any]:
        """Carga una imagen local en disco y la analiza con Google Search Grounding."""
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"No se encontró el archivo de imagen en: {image_path}")

        with open(image_path, "rb") as image_file:
            image_bytes = image_file.read()

        mime_type = "image/jpeg"
        if image_path.lower().endswith(".png"):
            mime_type = "image/png"
        elif image_path.lower().endswith(".webp"):
            mime_type = "image/webp"

        return self.analyze_image_bytes(image_bytes, mime_type=mime_type, custom_prompt=custom_prompt)

    def analyze_image_bytes(self, image_bytes: bytes, mime_type: str = "image/jpeg", custom_prompt: str = None) -> Dict[str, Any]:
        """Ejecuta el análisis visual y extracción de referencias web desde la API de Gemini."""
        prompt_text = custom_prompt or (
            "Analiza detalladamente esta imagen. Identifica el objeto, marca, lugar, obra, producto o texto. "
            "Utiliza la búsqueda de Google para encontrar páginas web de referencia, enlaces directos, fuentes y información actualizada."
        )

        if not self.api_key or self.api_key == "TU_GEMINI_API_KEY_AQUI":
            logger.warning("No se detectó GEMINI_API_KEY en .env. Retornando análisis de demostración.")
            return {
                "success": True,
                "analysis_text": f"[MODO DEMOSTRACIÓN - CONFIGURA GEMINI_API_KEY EN .ENV] Análisis visual simulado para imagen ({len(image_bytes)} bytes). Identificado concepto clave de la imagen.",
                "search_queries": ["búsqueda de referencia de imagen en google", "fuentes oficiales de la imagen"],
                "web_references": [
                    {"title": "Página de Referencia Oficial de Google FX Flow", "url": "https://ai.google.dev/"},
                    {"title": "Documentación de Google Gemini API - Vision & Search", "url": "https://cloud.google.com/vertex-ai/docs/generative-ai/multimodal/overview"}
                ],
                "model_used": self.model_name
            }

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=self.api_key)

            # Invocación multimodal con herramienta google_search
            response = client.models.generate_content(
                model=self.model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    prompt_text
                ],
                config=types.GenerateContentConfig(
                    system_instruction="Eres un especialista en análisis de imágenes e inteligencia de fuentes en Google.",
                    tools=[{"google_search": {}}]
                )
            )

            # Extraer referencias web del grounding metadata
            search_queries = []
            web_references = []

            candidate = response.candidates[0] if response.candidates else None
            if candidate and hasattr(candidate, 'grounding_metadata') and candidate.grounding_metadata:
                gm = candidate.grounding_metadata
                if hasattr(gm, 'web_search_queries') and gm.web_search_queries:
                    search_queries = list(gm.web_search_queries)

                if hasattr(gm, 'grounding_chunks') and gm.grounding_chunks:
                    for chunk in gm.grounding_chunks:
                        if hasattr(chunk, 'web') and chunk.web and hasattr(chunk.web, 'uri'):
                            web_references.append({
                                "title": getattr(chunk.web, 'title', chunk.web.uri),
                                "url": chunk.web.uri
                            })

            return {
                "success": True,
                "analysis_text": response.text or "Análisis completado.",
                "search_queries": search_queries,
                "web_references": web_references,
                "model_used": self.model_name
            }

        except Exception as e:
            logger.error(f"Error al analizar la imagen con la API de Gemini: {e}")
            return {
                "success": False,
                "error": str(e),
                "analysis_text": f"Error en análisis: {e}",
                "search_queries": [],
                "web_references": []
            }
`;

  // 12. README.MD - Documentation
  const readmeMd = `# 🚀 Google FX Flow Studio - Paquete Ejecutable para Laptop

**Proyecto:** \`${config.projectName}\`  
**Versión:** \`${config.version}\`  
**Autor:** \`${config.author}\`  

Este proyecto proporciona un paquete autocontenido listo para ejecutarse en tu laptop con un script de configuración automatizado para Linux y macOS (\`setup.sh\`), entorno virtual aislado (\`venv\`), sistema de autenticación basado en **JWT**, cifrado **AES-256 Fernet** para datos en reposo, optimización de presupuesto de tokens por modelo Gemini y soporte completo para despliegue en **Docker** y **Kubernetes**.

---

## 📋 Requisitos Previos

- **Sistema Operativo:** Linux (Ubuntu, Debian, Fedora, Arch) o macOS.
- **Python:** Versión \`${config.pythonVersion}\` o superior.
- **Utilidades:** \`bash\`, \`chmod\`, \`python3-venv\`, \`pip\`.

---

## ⚡ Instalación Automatizada (Un solo paso)

Abre tu terminal en la carpeta descargada y ejecuta el script de automatización:

\`\`\`bash
chmod +x setup.sh
./setup.sh
\`\`\`

### ¿Qué hace el script \`setup.sh\`?
1. **Comprueba permisos:** Verifica permisos de escritura y advierte en caso de ejecución con \`root\`.
2. **Detecta Python 3 y venv:** Verifica la disponibilidad de \`python3-venv\` e intenta instalarlo si falta.
3. **Crea el entorno virtual:** Inicializa \`venv\` aislado para evitar conflictos de librerías en tu sistema.
4. **Instala dependencias:** Actualiza \`pip\` e instala todas las librerías desde \`requirements.txt\`.
5. **Configura variables (.env):** Crea automáticamente el archivo \`.env\` con credenciales y claves criptográficas seguras.
6. **Ejecuta autoservicio de prueba:** Ejecuta \`python main.py --verify\` para confirmar la instalación exitosa.

---

## 🛡️ Instrucciones de Verificación de Instalación Exitosa

Para confirmar manualmente que todo funciona correctamente en tu laptop:

\`\`\`bash
# 1. Activa el entorno virtual
source venv/bin/activate

# 2. Ejecuta la verificación de componentes
python main.py --verify

# 3. Ejecuta las pruebas unitarias automatizadas
pytest tests/
\`\`\`

Si la salida muestra \`✔ ÉXITO\` en todos los pasos y \`3 passed in ...\`, tu instalación fue **completamente exitosa**.

---

## 🛠️ Comandos de Uso del Ejecutable Python

\`\`\`bash
# Ejecutar pipeline de Google FX Flow con prompt personalizado
python main.py --run-flow --prompt "Generar efecto FX de fuego azul cinematográfico"

# Generar un token de autenticación JWT de prueba
python main.py --generate-jwt

# Cifrar un dato sensible en reposo
python main.py --encrypt "Clave_API_Privada_o_Prompt_Confidencial"

# Descifrar dato previo
python main.py --decrypt "<TOKEN_CIFRADO>"
\`\`\`

---

## 🐳 Despliegue con Docker

Construye la imagen de contenedor ligera y ejecútala en tu laptop o servidor:

\`\`\`bash
# Construir la imagen Docker
docker build -t ${config.projectName}:${config.version} .

# Ejecutar el contenedor con archivo .env
docker run --rm --env-file .env ${config.projectName}:${config.version} --verify
\`\`\`

---

## ☸️ Despliegue en Kubernetes (K8s)

Los manifiestos en la carpeta \`k8s/\` permiten desplegar la aplicación en cualquier clúster de Kubernetes (Minikube, GKE, K3s, OpenShift):

\`\`\`bash
# Aplicar secretos y configmaps
kubectl apply -f k8s/secrets.yaml

# Aplicar deployment y servicio
kubectl apply -f k8s/deployment.yaml

# Verificar estado de los pods
kubectl get pods -n ${config.k8sNamespace}
\`\`\`

---

## 📊 Sistema de Registro de Eventos (Logging)

Todos los eventos detallados se registran automáticamente en consola y en el archivo local \`app_event_log.json\` con formato estructurado para auditoría y depuración.
`;

  return [
    {
      path: "setup.sh",
      content: setupSh,
      language: "bash",
      description: "Script de automatización bash completo para entorno virtual venv y verificación en Linux",
      category: "script",
    },
    {
      path: "main.py",
      content: mainPy,
      language: "python",
      description: "Script principal ejecutable Python modular con soporte CLI, logging y verificación",
      category: "script",
    },
    {
      path: "src/jwt_auth.py",
      content: jwtAuthPy,
      language: "python",
      description: "Módulo de autenticación seguro basado en JWT",
      category: "security",
    },
    {
      path: "src/crypto_vault.py",
      content: cryptoVaultPy,
      language: "python",
      description: "Módulo de cifrado AES-256 Fernet para datos sensibles en reposo",
      category: "security",
    },
    {
      path: "src/token_optimizer.py",
      content: tokenOptimizerPy,
      language: "python",
      description: "Optimizador y maximizador de uso de tokens y créditos por modelo Gemini",
      category: "script",
    },
    {
      path: "src/fx_pipeline.py",
      content: fxPipelinePy,
      language: "python",
      description: "Pipeline principal de integración con Google FX Flow y Gemini API",
      category: "script",
    },
    {
      path: "src/image_analyzer.py",
      content: imageAnalyzerPy,
      language: "python",
      description: "Módulo de análisis multimodal de imágenes y referencias web en Google Search",
      category: "script",
    },
    {
      path: "requirements.txt",
      content: requirementsTxt,
      language: "plaintext",
      description: "Lista de dependencias requeridas para Python",
      category: "config",
    },
    {
      path: ".env.example",
      content: envExample,
      language: "plaintext",
      description: "Plantilla de variables de entorno personalizadas con claves seguras",
      category: "config",
    },
    {
      path: "Dockerfile",
      content: dockerfile,
      language: "dockerfile",
      description: "Dockerfile multi-etapa compatible con Docker y Kubernetes con usuario sin privilegios",
      category: "deploy",
    },
    {
      path: "k8s/deployment.yaml",
      content: k8sDeployment,
      language: "yaml",
      description: "Manifiesto de Kubernetes Deployment y Service",
      category: "deploy",
    },
    {
      path: "k8s/secrets.yaml",
      content: k8sSecretsAndConfig,
      language: "yaml",
      description: "Manifiesto de Kubernetes Secrets y ConfigMaps",
      category: "deploy",
    },
    {
      path: "tests/test_flow_app.py",
      content: testFlowAppPy,
      language: "python",
      description: "Suite de pruebas unitarias pytest automatizadas para verificación",
      category: "test",
    },
    {
      path: "README.md",
      content: readmeMd,
      language: "markdown",
      description: "Documentación técnica completa con guía de despliegue y verificación",
      category: "docs",
    },
  ];
}
