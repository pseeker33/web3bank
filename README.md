# SimpleBank DApp 🏦

[![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)](https://docs.soliditylang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)](https://ethereum.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-yellow?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDMtMjBUMTY6MTA6MzctMDY6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDMtMjBUMTY6MTA6MzctMDY6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTAzLTIwVDE2OjEwOjM3LTA2OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY4YTc2ZjY1LTY4ZDgtNDI0Ni04YTRjLTM5NzRiYWZjNDU3ZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjZiNjQ2ODJmLWNmZTYtYjU0MC05NWIxLTljODNjNjVlMjUyZCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjljMDM0MGY4LTY4ZDgtNDI0Ni04YTRjLTM5NzRiYWZjNDU3ZiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjljMDM0MGY4LTY4ZDgtNDI0Ni04YTRjLTM5NzRiYWZjNDU3ZiIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0yMFQxNjoxMDozNy0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY4YTc2ZjY1LTY4ZDgtNDI0Ni04YTRjLTM5NzRiYWZjNDU3ZiIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0yMFQxNjoxMDozNy0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YcP8EwAAAZBJREFUOI2Nkr9LAnEYxj93d9pJFIqQQ0NCtNzS6hA0NUX/QENCtEVzQ7S1RENrS4ODu0NDQ0NDQzg4NLQ4NDg4ODg4ODg4ODg4ODg4KJ7T6fR54/2Ud0Lv9IXned7P5/k+7/O+UhiGJEmSBHwHfhzHQZZl7u/vKRQK1Go1UqkUi8WCdDrNZDLB932azSaGYeA4DqPRiEwmw2w2Q77VhW3bEZ7P51iWhed5pNNpXNdlOp2SzWbRdR3P89B1nclkgm3bWJZFoVCIxJUb4fl8znK5ZL1e43keQRCQz+ep1+tcXl5ydXVFp9MhCAJUVcV1XXzf5+bmJhJXbp0lScJ1XTKZDJZloes6x8fHnJ+f0+/3ub29xTRNPM+j2WzS6/W4u7sjl8tF4sqt8GazwXEcqtUq5XKZ09NTTk5OaLfbdLtdwjBktVpRLpdZr9dcX19zf3//Z1yJnqdarVKpVPB9n8FgwMPDA7quR4dSFIV2u02r1eLx8ZFcLvdvPIoD7Ha7KIqCqqoAvLy8sN1uGQ6HjMdjFEXh7e2N5+fnP+PfL6dpN7+P7uYAAAAASUVORK5CYII=)](https://hardhat.org/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ethers.js](https://img.shields.io/badge/ethers.js-2535a0?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVDiNpdM/S5VhGIfx72NKELQkQYsNbiK0BG3hW+gNtFQgRLQ0t7i5aA4JQeDS4Oa7EF0dpHcQGsIhCIRQa4j4KzheHc7peR44Z7kv7ut7nfv+nZBSQghRHMISvuEHZjCKL1hBd845p5RyBXfxF9+xhk+4wC/s4zYGcqkq7xvYxDb2sIV32E2Nr9DS14AXOMYnzGEcH7CFU7wt3TXOqzeBp1jECB7gGe7hENPYwzqe4wjbWL0ywFp6RI8QYgIvsY8vmMR0zvkQbzCBebzCWkopX9nUrxDCC4xhMed8FkJoYxJHOc9JKY19wEMcYyeldBZC6GAaDe2U0u9m838YfzjPW616b8r/x5kQwmBK6axX/BvJ+GGyHnPytQAAAABJRU5ErkJggg==)](https://docs.ethers.org/v6/)

SimpleBank es una DApp que simula las funciones básicas de un banco descentralizado en la blockchain de Ethereum. Permite a los usuarios conectar sus wallets MetaMask, registrarse, realizar depósitos y retiros, mientras cobra una pequeña comisión que se acumula en una tesorería que solo el propietario del contrato puede gestionar.

## 🛠 Tecnologías Utilizadas

- **Smart Contracts**: Solidity ^0.8.26
- **Desarrollo/Testing**: Hardhat
- **Frontend**: React + Vite
- **Blockchain Interaction**: ethers.js v6
- **Wallet**: MetaMask
- **Styling**: CSS

## 📁 Estructura del Proyecto

```
SimpleBank/
├── contract/
│   ├── contracts/
│   │   └── SimpleBank.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   ├── hardhat.config.js
│   └── package.json
└── client/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── App.css
    ├── public/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

### 📝 Archivos Principales

- `contract/contracts/SimpleBank.sol`: Contrato inteligente principal que maneja toda la lógica bancaria
- `contract/scripts/deploy.js`: Script para desplegar el contrato en la red
- `client/src/App.jsx`: Componente principal de React que maneja la interfaz de usuario
- `client/src/SimpleBankABI.json`: ABI del contrato necesario para la interacción frontend-contrato

## 🚀 Guía de Instalación y Uso

### Prerrequisitos

- Node.js >= 14.0.0
- MetaMask instalado en el navegador
- Git

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/SimpleBank.git
cd SimpleBank
```

### Paso 2: Instalar Dependencias

```bash
# Instalar dependencias del contrato
cd contract
npm install

# Instalar dependencias del cliente
cd ../client
npm install
```

### Paso 3: Configurar Red Local de Hardhat

1. Inicia el nodo local de Hardhat:
```bash
cd Contract
npx hardhat node
```

2. Configura MetaMask con la red local:
   - **Network Name**: Hardhat Local
   - **New RPC URL**: http://127.0.0.1:8545/
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

3. Importa las cuentas de prueba:
   - Del nodo local de Hardhat, copia la clave privada de la primera cuenta (Account #0), pues esa es la cuenta del propietario del contrato
   - Copia la clave privada de cualquiera de las cuentas siguientes y úsalos como usuarios del banco.
   - En MetaMask: "Importar Cuenta" -> Pega la clave privada

### Paso 4: Desplegar el Contrato

En una nueva terminal:
```bash
cd Contract
npx hardhat run scripts/deploy.js --network localhost
```

### Paso 5: Iniciar el Frontend

```bash
cd client
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🎯 Características Principales

- Conexión con MetaMask
- Registro de usuarios
- Depósitos y retiros de ETH
- Sistema de comisiones automático
- Gestión de tesorería para el propietario
- ToDo: Interfaz intuitiva y responsive

## 💼 Uso del Contrato

### Para Usuarios
1. Conecta tu wallet MetaMask
2. Regístrate con tu nombre y apellido
3. Realiza depósitos y retiros (se aplica una comisión del 5% en los retiros)

### Para el Propietario
1. Conecta la wallet propietaria
2. Monitorea las comisiones acumuladas
3. Retira los fondos de la tesorería cuando lo desees

## 🌐 DApp en Vivo

Prueba la DApp en: [https://simple-bank-dapp-fawn.vercel.app](https://simple-bank-dapp-fawn.vercel.app)

### Requisitos para Probar
1. Instala [MetaMask](https://metamask.io/)
2. Conecta tu wallet a la red Sepolia
3. Obtén ETH de prueba en [Sepolia Faucet](https://cloud.google.com/application/web3/faucet)  

Obs: recuerda que sólo el propietario del contrato puede retirar fondos de la tesorería  

## 🤝 Contribuciones

Las contribuciones son siempre bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## ⭐️ Muestra tu Apoyo

Si este proyecto te ha sido útil, considera [regalame](https://github.com/pseeker33/web3bank/stargazers) una ⭐. ¡Significa mucho para mí!

## 📫 Contacto

**Hoover Zavala**  
**Data analyst | Web developer | Blockchain enthusiast | Python | Bubble.io | React.js | Solidity**  

zavalah222@gmail.com      
[![Follow us on LinkedIn](https://img.shields.io/badge/LinkedIn-pseeker-blue?style=flat&logo=linkedin&logoColor=b0c0c0&labelColor=363D44)](https://www.linkedin.com/in/hoover-zavala-63a64825b/)  
[![X (formerly Twitter) URL](https://img.shields.io/twitter/url?url=https%3A%2F%2Ftwitter.com%2Fpseeker222&label=%40pseeker222)](https://twitter.com/pseeker222)


## 📝 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

[![made-with-solidity](https://img.shields.io/badge/Made%20with-Solidity-gray.svg?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![built-with-hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow?style=for-the-badge)](https://hardhat.org/)
[![made-with-react](https://img.shields.io/badge/Made%20with-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
