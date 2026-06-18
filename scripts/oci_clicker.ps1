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
$COMPARTMENT_ID    = "ocid1.tenancy.oc1..aaaaaaaamdulewwzuw4ars3cqfnwnpmqxhz3rt5uwp6pyyge2hwibj6euyba"
$SUBNET_ID         = "ocid1.subnet.oc1.eu-madrid-1.aaaaaaaajkjcxfbztm7abrb6ypieiecainwso4nbfrajbeu4muwonwprmxtq"
$IMAGE_ID          = "ocid1.image.oc1.eu-madrid-1.aaaaaaaakmvk43wzt7qupfux5ld5lnaznnz5gg7f2uwleogy3uomlcllqcda" # Ubuntu o Oracle Linux
$SHAPE             = "VM.Standard.A1.Flex"
$CPUS              = 4
$MEMORY_GB         = 24
$AVAILABILITY_DOMAIN = "zYbc:EU-MADRID-1-AD-1" # Ej: XYzQ:US-ASHBURN-AD-1

# Clave SSH para conectarte a la máquina una vez creada
$SSH_AUTHORIZED_KEY = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDkdMSA1hWKwRbnY109uxAIFwHbEjLVeEPyiF7t+XAnaNG6mMOi3h/5FucfUVrvnNqqKIADzcr3166j1Vm/VK0kpNT6qD6DOVT7ayT4iEwqsDWT3yyHAIFyOXRds54Jbqx3gjTVVmc4Povs+DIu51A5evSycAYFkO1INcd2j7bxcAoaVCIND8zWsXOJrZSkrX4V/YUjogERJy6C3TyR22n4g58QMrisPqKRgfVBg3ago+Z/crx2cVWtN6Qqfmd9zfL4NufFVYtSST4jsRQz2df1j55XcGvkwcUtlZ0mBySgq/XjBydfPhTP+CbVXD3K7wpSJV+d0i5IaF+IVg03KhRPaEKpGJZaPcJSAdvaoeQocE+kHO6AZ/gJfpaDjmGzsGPDtslUxjC02BO1aHKm1ocwFy2yWJLbkQWT1hJBO3OLXTtEapav/26xglCNaV+KS5aD9DMp83JDWOrEpYbB9O6dr3yHxRDA/BW9BCWbTtqnordLCGc4h+DiBGrqXgTd8Ik= hachi@LAPTOP-UPDU1PCO"

$INSTANCE_NAME     = "MainServer-4Core"
# ==========================================

# Sobrescribir la ruta por defecto donde OCI busca el config
$env:OCI_CLI_CONFIG_FILE = "C:\Users\hachi\OneDrive\Escritorio\Hecate_Serveis\oracle_keys\config"

$SLEEP_SECONDS     = 60 # Tiempo de espera entre intentos

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Iniciando OCI Clicker para 4x ARM..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para cancelar.`n"

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Intentando crear la instancia..." -ForegroundColor DarkGray
    
    # Truco "Anti-Suspensión": Simular la pulsación de una tecla invisible (F15) 
    # para engañar a Windows y evitar que el portátil hiberne por supuesta "inactividad".
    $wshell = New-Object -ComObject wscript.shell
    $wshell.SendKeys("{F15}")
    
    # Silenciar las advertencias de OCI que estropean el texto
    $env:SUPPRESS_LABEL_WARNING = "True"
    
    # Crear un archivo provisorio con tu clave SSH para que la CLI lo reconozca
    $tempKeyPath = "$env:TEMP\oci_temp_public_key.pub"
    $SSH_AUTHORIZED_KEY | Out-File -FilePath $tempKeyPath -Encoding ASCII -Force

    # Crear un archivo provisorio con el JSON del procesador para evitar fallos de comillas en Windows
    $tempShapePath = "$env:TEMP\oci_shape.json"
    '{"ocpus":4,"memoryInGBs":24}' | Out-File -FilePath $tempShapePath -Encoding ASCII -Force

    # Construcción y ejecución del comando de OCI CLI
    # (Capturamos tanto la salida estándar como los errores 2>&1)
    $output = oci compute instance launch `
        --availability-domain $AVAILABILITY_DOMAIN `
        --compartment-id $COMPARTMENT_ID `
        --shape $SHAPE `
        --shape-config "file://$tempShapePath" `
        --subnet-id $SUBNET_ID `
        --image-id $IMAGE_ID `
        --display-name $INSTANCE_NAME `
        --ssh-authorized-keys-file $tempKeyPath `
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
