<#
.SYNOPSIS
    Script "Clicker" para intentar crear una instancia ARM Ampere A1 (4 núcleos, 24GB RAM) 
    en Oracle Cloud Infrastructure (OCI).
    
    El Free Tier de Oracle para estas instancias frecuentemente arroja error "Out of capacity".
    Este script intenta lanzar la instancia de forma ininterrumpida hasta que lo consigue.

.DESCRIPTION
    Requisitos:
    1. Instalar la CLI de Oracle (OCI CLI) en Windows.
    2. Haber configurado 'oci setup config' con tus claves API.
    3. Rellenar las variables de abajo con tu Compartment ID, Subnet ID, y variables de la Instancia.
        - Puedes sacar estos IDs desde la consola de Oracle, intentando crear la instancia 
          manualmente, yendo a "Save as stack" o inspeccionando los campos.
#>

# ==========================================
# CONFIGURACIÓN (Rellena estos valores)
# ==========================================
$COMPARTMENT_ID    = "ocid1.compartment.oc1..XXXXXXXXXXXXXXXXXXXXXX"
$SUBNET_ID         = "ocid1.subnet.oc1..XXXXXXXXXXXXXXXXXXXXXX"
$IMAGE_ID          = "ocid1.image.oc1..XXXXXXXXXXXXXXXXXXXXXX" # Ubuntu o Oracle Linux
$SHAPE             = "VM.Standard.A1.Flex"
$CPUS              = 4
$MEMORY_GB         = 24
$AVAILABILITY_DOMAIN = "XXXX:XXXX-AD-1" # Ej: XYzQ:US-ASHBURN-AD-1

# Clave SSH para conectarte a la máquina una vez creada
$SSH_AUTHORIZED_KEY = "ssh-rsa AAAAB3NzaC1... tu_clave_publica_aqui"

$INSTANCE_NAME     = "MainServer-4Core"
# ==========================================

$SLEEP_SECONDS     = 60 # Tiempo de espera entre intentos

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Iniciando OCI Clicker para 4x ARM..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para cancelar.`n"

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Intentando crear la instancia..." -ForegroundColor DarkGray
    
    # Construcción y ejecución del comando de OCI CLI
    # (Capturamos tanto la salida estándar como los errores 2>&1)
    $output = oci compute instance launch `
        --availability-domain $AVAILABILITY_DOMAIN `
        --compartment-id $COMPARTMENT_ID `
        --shape $SHAPE `
        --shape-config "{`"ocpus`":$CPUS,`"memoryInGBs`":$MEMORY_GB}" `
        --subnet-id $SUBNET_ID `
        --image-id $IMAGE_ID `
        --display-name $INSTANCE_NAME `
        --ssh-authorized-keys $SSH_AUTHORIZED_KEY `
        --assign-public-ip true 2>&1
    
    $outputString = $output | Out-String

    if ($LASTEXITCODE -eq 0 -and $outputString -notmatch "Out of capacity" -and $outputString -notmatch "InternalError") {
        Write-Host "[$timestamp] ¡ÉXITO! Se ha creado la instancia (o el comando fue aceptado)." -ForegroundColor Green
        Write-Host $outputString
        # Reproducir un sonido de éxito repetidamente para avisarte :)
        1..5 | ForEach-Object { [System.Console]::Beep(1000, 500); Start-Sleep -Milliseconds 200 }
        break
    } else {
        if ($outputString -match "Out of capacity") {
            Write-Host "[$timestamp] Sin capacidad 😭. Reintentando en $SLEEP_SECONDS segundos..." -ForegroundColor Red
        } else {
            Write-Host "[$timestamp] Error desconocido, pero seguimos intentando. Reintentando en $SLEEP_SECONDS seg..." -ForegroundColor Yellow
            Write-Host "Detalle del error: $outputString" -ForegroundColor DarkGray
        }
    }
    
    Start-Sleep -Seconds $SLEEP_SECONDS
}
