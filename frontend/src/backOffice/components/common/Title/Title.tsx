import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Title.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type TitleProps = {
	name: string;
	icon: IconProp;
};
const Title = ({ name, icon }: TitleProps) => {
	return (
		<>
			<div className={styles.titleContainer}>
				<FontAwesomeIcon
					icon={icon}
					className={styles.iconSpaces}
					data-testid="icon-title"
				/>
				<h3>{name}</h3>
			</div>
		</>
	);
};

export default Title;
