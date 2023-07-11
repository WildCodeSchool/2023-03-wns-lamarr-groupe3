import style from "./header.module.scss";

const Header = () => {
  return (
    <header>
      <h1>City Guide</h1>
      <nav className={`textButton ${style.menu}`}>
        <ul>
          <li>Parcourir</li>
          <li>Abonnement</li>
          <li>Connexion</li>
        </ul>
        <button>Nous rejoindre</button>
        {/* <img src="" alt="language" /> */}
      </nav>
    </header>
  );
};

export default Header;
