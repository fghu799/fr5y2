import { zfd } from "zod-form-data";
import { typeToFlattenedError, z } from "zod";

const checkNewsletter = zfd.formData({
	email: zfd.text(z.string().email()),
	name: zfd.text().optional(),
	isPromoAllowed: zfd.checkbox(),
});

export type FormError = typeToFlattenedError<(typeof checkNewsletter)["_type"]>;

export const validateForm = (formData: FormData) => {
	return checkNewsletter.safeParse(formData);
};
