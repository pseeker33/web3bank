//SPDX-License-Identifier:MIT
pragma solidity ^0.8.26;

contract SimpleBank {

	address private owner;
	uint256 public treasuryBalance;
	uint public fee;

	//constructor(uint256 _treasury, uint _fee) {
	constructor(uint _fee) {
		owner = msg.sender;
		treasuryBalance = 0;
		fee = _fee;
	}

	struct User {
		string firstName;
		string lastName;
		uint saldo;
		bool registrado;
	}

	mapping (address => User) public userDetails;

	modifier onlyOwner {
		require(msg.sender == owner, "Solo el owner puede realizar la operacion");
		_;
	}

	modifier notTheOwner {
		require(msg.sender != owner, "El owner no puede realizar la operacion");
		_;
	}

	modifier onlyRegisteredUser {
		require(userDetails[msg.sender].registrado, "Solo usuarios registrados pueden realizar la operacion");
		_;
	}

	event UserRegistered(address indexed user, string firstName, string lastName);
	event Deposit(address user, uint amountDeposited);
	event Withdrawal(address indexed user, uint256 amountWithdrawed, uint256 fee);
	event TreasuryWithdrawal(address indexed contractOwner, uint256 amount);
	
	// Función pública para acceder a la dirección del owner
	function getOwner() public view returns (address) {
			require(owner != address(0), "Owner not initialized");
			return owner;
	}

	// Función para que cuentas externas se registren como usuarios
	function registerUser(string calldata _firstName, string calldata _lastName) external notTheOwner {
		require(!userDetails[msg.sender].registrado, "Ya estas registrado");
		require(bytes(_firstName).length > 0 && bytes(_lastName).length > 0, "Nombre o apellido vacio");
		
		userDetails[msg.sender].firstName = _firstName;
		userDetails[msg.sender].lastName = _lastName;
		userDetails[msg.sender].registrado = true;
		emit UserRegistered(msg.sender, _firstName, _lastName);
	}

	// Función para que los usuarios registrados depositen fondos a su cuenta
	function deposit() external payable onlyRegisteredUser {
		require(msg.value > 0, "El monto del deposito debe ser mayor a cero");
		userDetails[msg.sender].saldo += msg.value;
		emit Deposit(msg.sender, msg.value);
	}

	// Función para que los usuarios registrados verifiquen el saldo de su cuenta 
	function getBalance() external view onlyRegisteredUser returns (uint) {
		return userDetails[msg.sender].saldo;
	}
	
	// Función para que los usuarios registrados retiren fondos de su cuenta
	function withdraw(uint256 _amount) external onlyRegisteredUser {
		require(userDetails[msg.sender].saldo >= _amount, "Saldo insuficiente");
		
		uint256 feeAmount = (_amount * fee) / 10000; // Cálculo del fee
		uint256 netAmount = _amount - feeAmount; // Monto neto a retirar

		// Actualizar el saldo del usuario
		userDetails[msg.sender].saldo -= _amount; 

		// Incrementar el balance de la tesorería con el fee cobrado
		treasuryBalance += feeAmount;
		
		// Enviar el monto neto al usuario
		(bool userSuccess, ) = msg.sender.call{value: netAmount}("");
		require(userSuccess, "Transferencia al usuario fallida");
		
		// Emitir el evento Withdrawal
		emit Withdrawal(msg.sender, netAmount, feeAmount);
	}
	
	// Función para que el owner retire fondos de la tesorería
	function withdrawTreasury(uint256 _amount) external onlyOwner {
		require(treasuryBalance >= _amount, "Fondos insuficientes en la tesoreria");
		
		// Reducir el balance de la tesorería en el contrato
		treasuryBalance -= _amount;

		(bool sentToOwner, ) = owner.call{value: _amount}("");
		require(sentToOwner, "Error al transferir Ether al owner");

		// Emitir el evento de retiro de la tesorería
		emit TreasuryWithdrawal(owner, _amount);
		
	}
		
}