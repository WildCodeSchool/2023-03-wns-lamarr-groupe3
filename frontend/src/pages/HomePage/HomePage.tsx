import { useContext } from "react";

import SearchPOI from "../SearchPOI/SearchPOI";

import styles from "./homePage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../../contexts/UserContext";
import useWindowDimensions from "../../utils/hooks/useWindowDimensions";
import Layout from "../../components/layout/Layout";

const HomePage = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout, redirectToLogin } = useContext(UsersContext);
	// On vérifie si l'utilisateur est connecté.

	const windowSize: number = useWindowDimensions();

	return (
		<>
			<Layout>
				{windowSize > 768 ? (
					<>
						<section className={`${styles.backgroundWave}`}>
							<div
								className={`presentationText ${styles.presentationSection} `}
							>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit.
									Illum blanditiis aperiam ad, aspernatur incidunt voluptatem ea
									molestias nemo rem ratione nesciunt neque corporis nihil
									recusandae cum minima. Id, voluptatum tenetur?
								</p>
								<button
									className={`buttonHomePage textButton ${styles.presentationButton}`}
								>
									<FontAwesomeIcon icon={faPaperPlane} />
									Explorez
								</button>
							</div>
						</section>
						<section>
							<div className={`${styles.mapSection}`}></div>
							<div className={`${styles.pictoPlane}`}>
								<img src="/picto_avion.png" alt="picto avion" />
							</div>
						</section>
						<section className={`${styles.searchSection}`}>
							<SearchPOI />
						</section>
					</>
				) : (
					<section className={`${styles.mobileSection}`}>
						<h1>CITY GUIDE</h1>
						<img src="/wave_with_map_mobile.svg" alt="wave with map" />
						<button
							className={`buttonHomePage textButton ${styles.presentationButton}`}
						>
							Explorez
						</button>
						<SearchPOI />
					</section>
				)}
			</Layout>
		</>
	);
};

export default HomePage;
