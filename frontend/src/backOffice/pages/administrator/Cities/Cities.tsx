import BackOfficeLayout from "../../../components/layout/BackOfficeLayout";
import styles from "./Cities.module.scss";
import { faCity, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/common/Title/Title";
import { useEffect, useState } from "react";
import { City } from "../../../../utils/types";
import Checkbox from "../../../components/common/Checkbox/Checkbox";
import Button from "../../../components/common/Button/Button";
import Modal from "../../../components/modals/Modal";

// interface Props {
// 	city: City;
// 	openOnClick: (id: string) => void;
// 	modaleOpen: string | null;
// 	onClose: () => void;
// }
// 1. Récupérer la liste des villes depuis l'API.
// 2. Implémenter le Thead
// 3. Pour ville, implémenter la ligne (.map), en affichant les données et les boutons.
// 4. Gérer l'évènement de clic sur modifier
// 		- Déterminer quel comportement à adopter sur le bouton "Modifier".
// 		- Implémenter le formulaire et l'évènement de submit.
// 5. Gérer l'évènement de clic sur supprimer
// 		- Déterminer quel comportement à adopter sur le bouton "Suprimer"
// 			-> Ça supprime directement ? (dans un 1er temps)
// 			-> Modale (si on a le temps)
// 		- Implémenter le comportement sur le bouton modifier

// const Cities = ({ city, onClose }: Props) => {
const Cities = () => {
	const columns = [
		"Nom",
		"Coordonnées GPS",
		"Image",
		"Administrateur de ville",
	];

	// 1. Créer un state, appelé `cities`, qui va contenir la liste des villes
	const [cities, setCities] = useState<City[]>([]); // stockage des donnees de l'API
	// typage : au chargement liste vide ([]) et elle se rempli par le getCities <City[]> en qql fractions de seondes

	// 2. Créer un useEffect, qui s'exécute une fois, au lancement du composant,
	//    Dans ce useEffect, on charge les villes dans le state.
	// 		- GET /api/cities
	// 		- setCities(data)
	// appel à l'API
	const getCities = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/cities", {});
			const data = await response.json();
			setCities(
				data.map((item: any) => {
					return {
						...item,
						//coordinates: item.coordinates.coordinates,
						// ca modifiait le type coordinates plus besoin - le pb a ete resolu dans types.ts
					};
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCities();
	}, []);

	const [checkedCities, setCheckedCities] = useState<City[]>([]);
	// const [deletedCities, setDeletedCities] = useState<City[]>([]);

	// checkbox selectionne tout
	const handleSelectOrUnselectAll = () => {
		setCheckedCities(
			checkedCities.length === cities.length
				? // On déselectionne tout
				  []
				: // On sélectionne tout
				  cities
		);
	};

	// checxbox par ligne
	const handleSelectOrUnselectOne = (city: City) => {
		// On cherche si la ville est déjà dans le tableau des villes sélectionnées
		const cityFoundInSelectedCities = checkedCities.find(
			(c) => c.id === city.id
		);

		// Si elle est déjà dans le tableau, on la retire
		if (cityFoundInSelectedCities) {
			setCheckedCities(
				checkedCities.filter((city) => city.id !== cityFoundInSelectedCities.id)
			);
			// Si elle n'est pas dans le tableau, on l'ajoute
		} else {
			setCheckedCities([...checkedCities, city]);
		}
	};
	// DELETE One City
	const handleDeleteOneCity = async (cityToDelete: City) => {
		// console.log(cityToDelete.id);
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
		} catch (error) {
			console.log("delete error", error);
		}
	};

	//  UPDATE, Modify One City
	const [isModalOpen, setIsModalOpen] = useState(false); // par defaut la modal est masqué false

	const handleUpdateOneCity = (city: City) => {
		// const selectOnecity = city.id;
		// const updateOneCity = selectCities.find(
		// 	(c) => c.id === city.id
		// );
		// // Si elle est déjà dans le tableau, on la retire
		// if (updateOneCity) {
		// 	setCheckedCities(
		// 		isModalOpen.filter((city) => city.id !== updateOneCity.id)
		// 	);
		// 	// Si elle n'est pas dans le tableau, on l'ajoute
		// } else {
		// 	setCheckedCities([...isModalOpen, city]);
		// }

		// oepn modal
		setIsModalOpen(true);
		setIsModalOpen(!isModalOpen);
	};
	const handleCloseModal = () => {
		// close modal
		setIsModalOpen(false);
	};

	return (
		<BackOfficeLayout>
			<Title icon={faCity} name={"Villes"}></Title>
			<h4 className={`${styles.subtitleTable} subtitleDashboard`}>
				Liste des villes
			</h4>
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
					{cities.map((city) => {
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
									{city.coordinates.coordinates[0]}
									{city.coordinates.coordinates[1]}
								</td>
								<td className={`fieldTableBody`}>{city.image}</td>
								<td className={`fieldTableBody`}>
									{city.userAdminCity?.username}
								</td>
								<td className={styles.titleTable}>
									{isModalOpen.toString()}
									<Button
										icon={faPen}
										onClick={() => {
											handleUpdateOneCity(city);
										}}
									/>
									<Modal
										onClose={handleCloseModal}
										isOpen={isModalOpen}
										city={city}
									></Modal>
								</td>
								<td className={styles.endColumn}>
									<Button
										icon={faTrashCan}
										onClick={() => handleDeleteOneCity(city)}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</BackOfficeLayout>
	);
};

export default Cities;

// const table = data.map(({ title, image }) => {
// 	return (
// 		<Table
// 			title={name}
// 			image={image}

// 		/>
// 	);
// });

// import Table from "../../../components/common/Table/Table";
// import { DataType, TableType } from "../../../../utils/types";

// interface TableProps {
// 	title: string;
// 	data: DataType;
//     tableType: TableType;
// }

// const Cities = ({title, data, tableType}: TableProps) => {
