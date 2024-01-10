import styles from "./Modal.module.scss";
import { City, Coordinates, User } from "./../../../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRef } from "react";
import { updateCity, addCity } from "../../../utils/api";

export interface InputFormData {
	name: string;
	coordinates: number[];
	image: File[] | string;
	userAdminCity: string;
}

interface Props {
	city: City | InputFormData;
	onClose: () => void;
	isOpen: boolean;
	type: string;
}

// pour le cas ajouter un ville  si j'ouvre la modal je ne rempli pas le champ input

const Modal = ({ city, onClose, isOpen, type }: Props) => {
	// const { id, name, coordinates, userAdminCity } = city;
	// const [formData, setFormData] = useState<IFormData>({
	const [inputFormData, setInputFormData] = useState<InputFormData>({
		name: city.name,
		coordinates:
			type === "modifyCity"
				? (city.coordinates as Coordinates).coordinates
				: (city.coordinates as number[]),
		image: city.image,
		userAdminCity: city.userAdminCity
			? (city.userAdminCity as User).username
			: "",
	});
	// console.log(" city.coordinates", city.coordinates);
	// ou objet vide si modal ajout ou modal prérempli si update

	const handleInputChange = (value: any, key: string) => {
		if (key === "coordinates[0]") {
			setInputFormData({
				...inputFormData,
				coordinates: [value, inputFormData.coordinates[1]],
			});
		} else if (key === "coordinates[1]") {
			setInputFormData({
				...inputFormData,
				coordinates: [inputFormData.coordinates[0], value],
			});
		} else {
			setInputFormData({ ...inputFormData, [key]: value });
		}
	};
	const inputRef = useRef<HTMLInputElement | null>(null);
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// const formData = new FormData();
		const formData = new FormData(event.currentTarget);
		console.log(event.currentTarget.image);
		// console.log(event.currentTarget.name as HTMLInputElement);
		console.log(inputFormData);

		Object.keys(inputFormData).forEach((key) => {
			if (key !== "image") {
				formData.append(
					key,
					inputFormData[key as keyof InputFormData] as string
				);
			}
		});

		// include image file in body
		console.log("inputRef.current ", inputRef);

		if (inputRef.current !== null && inputRef.current.files) {
			formData.append("image", inputRef.current.files[0]);
		}

		for (let pair of formData.entries()) {
			console.log(pair[0] + ", " + pair[1]);
		}
		type === "modifyCity"
			? updateCity(inputFormData, (city as City).id as string) //formData
			: // : addCity(inputFormData);
			  addCity(formData);
	};

	return (
		<>
			{isOpen && (
				<section className={styles.modalContainer}>
					<button onClick={onClose} className={styles.closeButton}>
						<FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
					</button>
					<form onSubmit={handleSubmit}>
						{/* <form onSubmit={handleSubmit(onSubmit)}> */}
						<div className={styles.simpleInput}>
							<label htmlFor="Nom ville">Nom ville</label>
							<input
								type="text"
								value={inputFormData.name}
								className={styles.inputModal}
								onChange={(event) =>
									handleInputChange(event.target.value, "name")
								}
								name="name"
								// required
							/>
						</div>
						<label htmlFor="Coordonnées GPS">Coordonnées GPS</label>
						<div className={styles.doubleInput}>
							<div>
								<label htmlFor="Latitude">Latitude</label>
								<input
									type="text"
									value={inputFormData.coordinates[0]}
									className={styles.inputModal}
									onChange={(event) =>
										handleInputChange(event.target.value, "coordinates[0]")
									}
									// name="coordinates0"
									name="coordinates[]"
								/>
							</div>
							<div>
								<label htmlFor="Longitude">Longitude</label>
								<input
									type="text" // type="number"
									value={inputFormData.coordinates[1]}
									className={styles.inputModal}
									onChange={(event) =>
										handleInputChange(event.target.value, "coordinates[1]")
									}
									name="coordinates[]"
								/>
							</div>
						</div>
						{/* <div className={styles.simpleInput}>
							<label htmlFor="Image">Image</label>
							<input
								type="text"
								// value={city.image}
								value={inputFormData.image as string}
								className={styles.inputModal}
								onChange={(event) =>
									handleInputChange(event.target.value, "image")
								}
								name="image"
							/>
						</div> */}
						<div className={styles.simpleInput}>
							<label htmlFor="Image perso">Image perso</label>
							<input
								type="file"
								className={styles.inputModal}
								name="image"
								ref={inputRef} // ref sur l'input pour recuperer son contenu
							/>
						</div>
						<div className={styles.simpleInput}>
							<label htmlFor="Administrateur de ville">
								Administrateur de ville
							</label>
							<input
								type="text"
								value={inputFormData.userAdminCity}
								className={styles.inputModal}
								onChange={(event) =>
									handleInputChange(event.target.value, "userAdminCity")
								}
								name="userAdminCity"
							/>
						</div>
						<button type="submit" className={styles.buttonModal}>
							Valider
						</button>
					</form>
				</section>
			)}
		</>
	);
};
export default Modal;
