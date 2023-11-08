import styles from "./BackOfficeHomePage.module.scss";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import BackOfficeLayout from "../../components/layout/BackOfficeLayout";
import Title from "../../components/common/Title";

const HomePage = () => {
	return (
		<BackOfficeLayout>
			<Title
				icon={faHouse}
				name={"Bienvennue sur le Dashboard Administrateur"}
			/>
			<div className={styles.illustrationBackOffice}></div>
		</BackOfficeLayout>
	);
};

export default HomePage;
