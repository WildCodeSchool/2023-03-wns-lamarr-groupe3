import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Button.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type interfaceButtonProps = {
	icon?: IconProp;
	onClick: () => void;
	typeButton: string;
	text?: string;
	dataTestId?: string;
	iconType?: string;
};
const Button = ({
	icon,
	onClick,
	typeButton,
	text,
	dataTestId,
}: interfaceButtonProps) => {
	return (
		<>
			<button
				className={
					typeButton === "icon" ? styles.buttonIcon : styles.buttonText
				}
				onClick={onClick}
				// data-testid={typeButton === "icon" ? "buttonIcon" : "buttonText"}
				// data-testid={`${typeButton}-${dataTestId}`}
				data-testid={dataTestId}
			>
				{typeButton === "icon" && <FontAwesomeIcon icon={icon as IconProp} />}
				{typeButton === "text" && <p>{text}</p>}
			</button>
		</>
	);
};
export default Button;
