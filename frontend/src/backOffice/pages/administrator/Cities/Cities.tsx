import BackOfficeLayout from "../../../components/layout/BackOfficeLayout";
import styles from "./Cities.module.scss";
import { faCity, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/common/Title/Title";
import { useEffect, useState } from "react";
import { City } from "../../../../utils/types";
import Checkbox from "../../../components/common/Checkbox/Checkbox";
import Button from "../../../components/common/Button/Button";
import Modal from "../../../../components/common/modals/Modal";
import ModalAdmin from "../../../components/modals/ModalAdmin";

const Cities = () => {
	const columns = [
		"Nom",
		"Coordonnées GPS",
		"Image",
		"Administrateur de ville",
	];

	const [cities, setCities] = useState<City[]>([]);
	const getCities = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_PUBLIC_BACKEND_URL}/api/cities`,
				{}
			);
			const data = await response.json();
			setCities(
				data.map((item: any) => {
					return item;
				})
			);
			console.log("data", data);
		} catch (error) {
			console.log(error);
		}
	};

	const [checkedCities, setCheckedCities] = useState<City[]>([]);

	const handleSelectOrUnselectAll = () => {
		setCheckedCities(checkedCities.length === cities.length ? [] : cities);
	};

	const handleSelectOrUnselectOne = (city: City) => {
		const cityFoundInSelectedCities = checkedCities.find(
			(c) => c.id === city.id
		);

		if (cityFoundInSelectedCities) {
			setCheckedCities(
				checkedCities.filter((city) => city.id !== cityFoundInSelectedCities.id)
			);
		} else {
			setCheckedCities([...checkedCities, city]);
		}
	};
	// DELETE One City
	const handleDeleteOneCity = async (cityToDelete: City) => {
		try {
			await fetch(`http://localhost:5000/api/cities/${cityToDelete.id}`, {
				method: "DELETE",
				credentials: "include",
				body: null,
			});
			const updatedCities = cities.filter(
				(city) => city.id !== cityToDelete.id
			);
			setCities(updatedCities);
			setDisplayModals({ ...displayModals, validation: true });
		} catch (error) {
			console.log("delete error", error);
		}
	};

	//  UPDATE, Modify One City
	const [isModalOpenModify, setIsModalOpenModify] = useState<boolean>(false);

	const [cityToModified, setcityToModified] = useState<City | null>(null);

	const handleUpdateOneCity = (city: City) => {
		console.log("handleUpdateOneCity city", city);

		setcityToModified(city);
		setIsModalOpenModify(true);
	};

	// ADDED One City
	const [isModalOpenAdd, setIsModalOpenAdd] = useState<boolean>(false);
	const newCity = {
		name: "",
		coordinates: [0, 0],
		image: "",
		userAdminCity: "",
	};

	// Close Modal for Add and Modify modal
	const handleCloseModal = () => {
		setIsModalOpenModify(false);
		setIsModalOpenAdd(false);
	};

	// state for modal management
	const [displayModals, setDisplayModals] = useState<{
		validation: boolean;
		error: boolean;
	}>({
		validation: false,
		error: false,
	});

	useEffect(() => {
		getCities();
	}, [isModalOpenAdd, isModalOpenModify]);

	return (
		<BackOfficeLayout>
			{displayModals.validation ? (
				<Modal
					setDisplayModals={setDisplayModals}
					displayModals={displayModals}
					type="validation"
					setIsModalOpenModify={setIsModalOpenModify}
					isModalOpenModify={isModalOpenModify}
					setIsModalOpenAdd={setIsModalOpenAdd}
					isModalOpenAdd={isModalOpenAdd}
				/>
			) : null}
			<Title icon={faCity} name={"Villes"}></Title>
			<div className={styles.titleAndButton}>
				<h4 className={`${styles.subtitleTable} subtitleDashboard`}>
					Liste des villes
				</h4>
				<Button
					typeButton="text"
					text="Ajouter une ville"
					onClick={() => setIsModalOpenAdd(true)}
					dataTestId={"add-button"}
				/>
			</div>
			<table>
				<thead>
					<tr>
						<th className={styles.startColumn}>
							<Checkbox
								value={checkedCities.length === cities.length}
								onChange={handleSelectOrUnselectAll}
							/>
						</th>

						{columns.map((column) => (
							<th
								key={column}
								className={`${styles.titleTable} fieldTableHead`}
							>
								{column}
							</th>
						))}
						<th className={`${styles.titleTable} fieldTableHead`}>Modifier</th>
						<th className={`${styles.titleTable} fieldTableHead`}>Supprimer</th>
					</tr>
				</thead>
				<tbody>
					{cities.map((city, index) => {
						return (
							<tr key={city.id}>
								<td className={styles.startColumn}>
									<Checkbox
										value={!!checkedCities.find((c) => c.id === city.id)}
										onChange={() => handleSelectOrUnselectOne(city)}
									/>
								</td>
								<td className={`fieldTableBody`}>{city.name}</td>
								<td className={`fieldTableBody`}>
									<div className={styles.fieldCoordinates}>
										<span>Lattitude : {city.coordinates.coordinates[0]}</span>
										<span>Longitude : {city.coordinates.coordinates[1]}</span>
									</div>
								</td>
								<td className={`${styles.fieldImage} fieldTableBody`}>
									{city.image}
								</td>
								<td className={`fieldTableBody`}>
									{city.userAdminCity?.username}
								</td>
								<td className={styles.titleTable}>
									<Button
										icon={faPen}
										onClick={() => {
											handleUpdateOneCity(city);
										}}
										typeButton={"icon"}
										dataTestId={`${index}-modify-button`}
									/>
								</td>
								<td className={styles.endColumn}>
									<Button
										icon={faTrashCan}
										onClick={() => handleDeleteOneCity(city)}
										typeButton={"icon"}
										dataTestId={"delete-button"}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{isModalOpenModify && (
				<ModalAdmin
					onClose={handleCloseModal}
					isOpen={true}
					city={cityToModified as City}
					type="modifyCity"
					setDisplayModals={setDisplayModals}
					displayModals={displayModals}
				></ModalAdmin>
			)}
			{isModalOpenAdd && (
				<ModalAdmin
					onClose={handleCloseModal}
					isOpen={true}
					city={newCity}
					type="addCity"
					setDisplayModals={setDisplayModals}
					displayModals={displayModals}
				></ModalAdmin>
			)}
		</BackOfficeLayout>
	);
};

export default Cities;
