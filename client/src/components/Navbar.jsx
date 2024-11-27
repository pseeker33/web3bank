import { useState, useCallback } from "react";
import "../Navbar.css";

export const Navbar = ({
  account,
  balance,
  isRegistered,
  setAccount,
  onConnectWallet
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    setAccount(null);
    setIsMenuOpen(false);
  }, [setAccount]);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(account);
      alert("Address copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy address: ", error);
    }
  }, [account]);

  return (
    <div className="navbar">
      <div className="navbar-title">Web3 Bank App</div>
      <div className="navbar-connected">
        {account && isRegistered ? (
          <div className="profile-menu">
            <div
              className="avatar"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <div>{balance ? `${balance} ETH` : "Loading..."}</div>
              <img
                src="https://avatars.dicebear.com/api/male/username.svg"
                alt="Avatar"
                className="avatar-img"
              />
            </div>
            {isMenuOpen && (
              <div className="menu-dropdown">
                <div className="menu-item">
                  <img
                    src="https://avatars.dicebear.com/api/male/username.svg"
                    alt="Avatar"
                    className="avatar-large"
                  />
                </div>
                <div className="menu-item">
                  <span>{account}</span>
                  <button onClick={handleCopyAddress} className="copy-btn" aria-label="Copy address">
                    📋
                  </button>
                </div>
                <div className="menu-item">
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : !account && !isRegistered ? (
          <div className="connect-navbar-wallet">
            <button onClick={onConnectWallet}>Conectar Wallet</button>
          </div>
        ) : (
          <div className="info-message">
            Please register
          </div>
        )}
      </div>
    </div>
  );
};




/* import { useState } from "react";
import "../Navbar.css";

export const Navbar = ({
  account,
  balance,
  isRegistered,
  setAccount,
  onConnectWallet
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setAccount(null);
    setIsMenuOpen(false);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account);
  };

  return (
    <div className="navbar">
      <div className="navbar-title">Web3 Bank App</div>
      <div className="navbar-connected">
        {account && isRegistered && (
          <div className="profile-menu">
            <div className="avatar" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div>{balance ? `${balance} ETH` : "Loading..."}</div>
              <img
                src="https://avatars.dicebear.com/api/male/username.svg"
                alt="Avatar"
                className="avatar-img"
              />
            </div>
            {isMenuOpen && (
              <div className="menu-dropdown">
                <div className="menu-item">
                  <img
                    src="https://avatars.dicebear.com/api/male/username.svg"
                    alt="Avatar"
                    className="avatar-large"
                  />
                </div>
                <div className="menu-item">
                  <span>{account}</span>
                  <button onClick={handleCopyAddress} className="copy-btn">
                    📋
                  </button>
                </div>
                <div className="menu-item">
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {!account && (
          <div className="connect-navbar-wallet">
            <button onClick={onConnectWallet}>Conectar Wallet</button>
          </div>
        )}
      </div>
    </div>
  );
}; */

