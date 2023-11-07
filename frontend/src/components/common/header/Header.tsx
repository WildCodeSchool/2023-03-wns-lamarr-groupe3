import style from "./header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMap,
	faMagnifyingGlass,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UsersContext } from "../../../contexts/UserContext";
import { Role } from "../../../utils/types";
// import ProfileMenu from "../../profile/profileMenu/profileMenu";

type headerProps = {
	size: string;
};

const Header = ({ size }: headerProps) => {
	// get user's role
	const { profile, logout, redirectToLogin } = useContext(UsersContext);

	let role = Role.VISITOR;
	if (profile != null) {
		role = profile.role;
	}

	// display profile menu
	const [displayProfileMenu, setDisplayProfileMenu] = useState(false);

	async function handleSignOut() {
		// Appeler le backend pour se déconnecter
		await logout();

		// Nous rediriger vers la page de connexion
		redirectToLogin();
	}

	return (
		<>
			<header
				className={
					size === "desktop"
						? `${style.headerDesktop}`
						: `${style.headerMobile}`
				}
			>
				{size === "desktop" ? (
					<>
						<Link to="/">
							<h1>CITY GUIDE</h1>
						</Link>
						<nav className={`textButton ${style.menu}`}>
							<ul>
								<li>
									<a href="#parcourir">Parcourir</a>
								</li>
								<li>
									<a href="#abonnement">Abonnement</a>
								</li>

								{role === Role.VISITOR ? (
									<li>
										<Link to="/auth/login">Connexion</Link>
									</li>
								) : null}
								{role === Role.ADMIN ? (
									<li>
										<Link to="/dashboard">Dashboard</Link>
									</li>
								) : null}
							</ul>
							{role === Role.VISITOR ? (
								<button className={`${style.buttonHeader} textButton`}>
									<Link to="/auth/register">Nous rejoindre</Link>
								</button>
							) : (
								<button
									className={`${style.avatarButton} textButton`}
									onClick={() => setDisplayProfileMenu(!displayProfileMenu)}
								>
									{profile?.image !== null ? (
										<img src={profile?.image} alt="avatar" />
									) : (
										profile?.username.substring(0, 1).toUpperCase()
									)}
								</button>
							)}
							{displayProfileMenu ? (
								<div className={`${style.floatingMenu} textSearch`}>
									<Link to="/">Mon profil</Link>
									<button onClick={handleSignOut}>Se déconnecter</button>
								</div>
							) : null}
						</nav>
					</>
				) : (
					<nav>
						<FontAwesomeIcon icon={faMap} className={`${style.iconStyle}`} />
						<FontAwesomeIcon
							icon={faMagnifyingGlass}
							className={`${style.iconStyle}`}
						/>
						<FontAwesomeIcon icon={faUser} className={`${style.iconStyle}`} />
					</nav>
				)}
			</header>
		</>
	);
};

export default Header;
