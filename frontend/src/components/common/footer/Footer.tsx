import styles from "./Footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faInstagram,
	faLinkedin,
	faSquareFacebook,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
	return (
		<div className={`${styles.mainFooter}`}>
			<div className={`${styles.mobileImage}`}>
				<section className={`${styles.sectionFooter}`}>
					<div className={`${styles.titleLogoFooter}`}>
						<h3 className={`titleFooter`}>City Guide</h3>
						<div className={`${styles.imageLayout}`}>
							<img
								src="/picto_footer.png"
								alt="picto_footer"
								className={`${styles.image01}`}
							/>
						</div>
					</div>
					<div className={`${styles.categoryFooter}`}>
						<div className={`${styles.layoutCategory}`}>
							<div>
								<h4 className={`${styles.subtitleFooter} textCard`}>Contact</h4>
								<ul className={`textSearch`}>
									<li>Nous contacter</li>
									<li>FAQ</li>
								</ul>
							</div>
							<div>
								<h4 className={`${styles.subtitleFooter} textCard `}>
									A propos
								</h4>
								<ul className={`textSearch`}>
									<li>À propos</li>
									<li>Presse</li>
									<li className={`${styles.specificSubCategory}`}>
										Conditions générales
										<span>d’utilisation</span>
									</li>
								</ul>
							</div>
							<div>
								<h4 className={`${styles.subtitleFooter} textCard`}>
									Réseaux sociaux
								</h4>
								<div className={`${styles.layoutPicto}`}>
									<FontAwesomeIcon
										icon={faInstagram}
										className={`${styles.iconColor}`}
									/>
									<FontAwesomeIcon
										icon={faSquareFacebook}
										className={`${styles.iconColor}`}
									/>
									<FontAwesomeIcon
										icon={faLinkedin}
										className={`${styles.iconColor}`}
									/>
								</div>
								<p className={`textSearch`}>Politiques de confidentialité</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};
export default Footer;
