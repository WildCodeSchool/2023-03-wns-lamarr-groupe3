import Joi from "joi";

const callRestApi = async (
	method: string,
	path: string,
	body?: any,
	inputHeaders?: Record<string, string>
) => {
	const url = `${process.env.REACT_APP_PUBLIC_BACKEND_URL}/${path}`;

	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	for (const key in inputHeaders) {
		headers.append(key, inputHeaders[key]);
	}

	try {
		const response = await fetch(url, {
			body: body ? JSON.stringify(body) : undefined,
			credentials: "include",
			headers,
			method,
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

// ADD A FAVOURITE CITY

export const addFavouriteCityToUser = async (
	cityId: string,
	userId: string
): Promise<void> => {
	try {
		/*  const data = await callRestApi(
          'POST',
          `/api/profile/fav/city/${userId}/${cityId}`
       ); */

		const response = await fetch(
			`http://localhost:5000/api/profile/fav/city/${userId}/${cityId}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: null,
			}
		);
		const data = await response.json();
		console.log("data", data);
	} catch (error) {
		console.log("error", error);
	}
};

// REMOVE A CITY FROM FAVOURITES

export const removeFavouriteCityToUser = async (
	cityId: string,
	userId: string
): Promise<void> => {
	try {
		const response = await fetch(
			`http://localhost:5000/api/profile/fav/city/${userId}/${cityId}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		);
		const data = await response.json();
		console.log("delete date", data);
	} catch (error) {
		console.log("delete error", error);
	}
};

// ADD A POI TO FAVOURITE

export const addFavouritePoiToUser = async (poiId: string, userId: string) => {
	try {
		const response = await fetch(
			`http://localhost:5000/api/profile/fav/poi/${userId}/${poiId}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: null,
			}
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

// REMOVE A POI FROM FAVOURITE

export const removeFavouritePoiToUser = async (
	poiId: string,
	userId: string
): Promise<void> => {
	try {
		const response = await fetch(
			`http://localhost:5000/api/profile/fav/poi/${userId}/${poiId}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.log("delete error", error);
	}
};

// UPDATE USER

export const updateUserExceptPassword = async (
	id: string,
	body: any,
	type: string
): Promise<any> => {
	// SET HEADERS
	const headers = new Headers();
	if (type === "json") {
		headers.append("Content-Type", "application/json");
	} else {
		headers.append("Accept", "application/json");
	}
	// VALIDATE DATA WITH JOI
	const schema = Joi.object({
		city: Joi.string().allow(null, ""),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.messages({
				"string.email": `L'email doit être valide`,
				"string.empty": `Ce champ ne peut pas être vide`,
			}),
		password: Joi.string()
			.min(8)
			.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/)
			.messages({
				"string.empty": `Ce champ ne peut être vide`,
				"string.min": `Le mot de passe doit contenir au moins 8 caractères`,
				"string.pattern.base": `Le mot de passe doit contenir au moins 8 caractères, 1 chiffre, une majuscule et 1 symbole`,
			}),
		username: Joi.string()
			.pattern(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{3,20}$/)
			.min(3)
			.max(20)
			.messages({
				"string.empty": `Ce champ ne peut pas être vide`,
				"string.pattern.base": `Le pseudo doit faire entre 3 et 20 caractères et ne peut contenir que des lettres et des chiffres`,
				"string.min": `Le pseudo doit faire au moins 3 caractères`,
				"string.max": `Le pseudo doit faire au max 20 caractères`,
			}),
		bio: Joi.string().allow(null, ""),
		id: Joi.string(),
		image: Joi.string().allow(null, ""),
		role: Joi.string(),
		createdPoi: Joi.array(),
		favouriteCities: Joi.array(),
		favouritePoi: Joi.array(),
	});
	const checkFormDatas = schema.validate(body);
	if (checkFormDatas.error) {
		return {
			key: checkFormDatas.error.details[0].context?.key,
			error: checkFormDatas.error.details[0].message,
		};
	} else {
		try {
			const response = await fetch(`http://localhost:5000/api/profile/${id}`, {
				method: "PUT",
				credentials: "include",
				headers,
				body: type === "json" ? JSON.stringify(body) : body,
			});
			const data = await response.json();
			return data;
		} catch (error) {
			console.log("Error while updating user", error);
		}
	}
};

export const updateUserPassword = async (
	id: string,
	body: any
): Promise<any> => {
	// VALIDATE DATA WITH JOI
	const schema = Joi.object({
		originalPassword: Joi.string()
			.min(8)
			.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/)
			.messages({
				"string.empty": `Ce champ ne peut être vide`,
				"string.min": `Le mot de passe doit contenir au moins 8 caractères`,
				"string.pattern.base": `Le mot de passe doit contenir au moins 8 caractères, 1 chiffre, une majuscule et 1 symbole`,
			}),
		newPassword: Joi.string()
			.min(8)
			.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/)
			.messages({
				"string.empty": `Ce champ ne peut être vide`,
				"string.min": `Le mot de passe doit contenir au moins 8 caractères`,
				"string.pattern.base": `Le mot de passe doit contenir au moins 8 caractères, 1 chiffre, une majuscule et 1 symbole`,
			}),
	});
	const checkFormDatas = schema.validate(body);
	if (checkFormDatas.error) {
		return {
			key: checkFormDatas.error.details[0].context?.key,
			error: checkFormDatas.error.details[0].message,
		};
	} else {
		try {
			const response = await fetch(
				`http://localhost:5000/api/auth/newpassword/${id}`,
				{
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
				}
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.log("Error while updating password", error);
		}
	}
};

// DELETE USER

export const deleteUser = async (id: string): Promise<void> => {
	try {
		const response = await fetch(`http://localhost:5000/api/profile/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log("delete error", error);
	}
};

// CREATE POI

export const createPoi = async (body: any) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_PUBLIC_BACKEND_URL}/api/poi`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
				},
				credentials: "include",
				body: body,
			}
		);

		return response;
	} catch (error) {
		console.log("createPoi error", error);
	}
};

// UPDATE CITY
export const updateCity = async (body: any, id: string): Promise<void> => {
	try {
		const response = await fetch(`${process.env.REACT_APP_PUBLIC_BACKEND_URL}/api/cities/${id}`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
			body: body,
		});
		const data = await response.json();

		return data;
	} catch (error) {
		console.log("update error", error);
	}
};

// ADD CITY

export const addCity = async (body: any): Promise<void> => {
	try {
		const response = await fetch("http://localhost:5000/api/cities", {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
			body: body,
		});
		console.log("addCity response", response);

		const data = await response.json();
		console.log("addCity data", data);

		return data;
	} catch (error) {
		console.log("add error", error);
	}
};
