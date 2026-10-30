import PigLogo from "./PigLogo";

function Header({ onAddTransaction, onResetData, showForm }) {
  return (
    <>
      <header className="header">
        <div className="title-logo">
          <PigLogo className="pig-logo" />
          <h1>Budget Tracker</h1>
        </div>
        <p>Personal finance overview</p>
      </header>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          width: "100%",
          margin: "0 50px",
          padding: "0 30%",
          height: "50px",
        }}
      >
        <button type="button" className="add-transaction-button" onClick={onAddTransaction}>
          Add transaction
        </button>
        <button type="button" className="reset-data-button" onClick={onResetData}>
          Reset data
        </button>
      </div>
    </>
  );
}

export default Header;
