import { submitForm } from "astro-form-actions/client";
import { FormError, validateForm } from "../lib/form";
import { JSX, Show, createSignal } from "solid-js";

export const Form = (props: {
	errorData: FormError | null;
	inputValues: Record<any, any>;
}) => {
	const ErrorMessage = (props: { children: JSX.Element }) => {
		return <p class="text-red-400 text-sm">{props.children}</p>;
	};
	const [errors, setErrors] = createSignal(props.errorData);
	const [message, setMessage] = createSignal("");
	return (
		<form
			method="post"
			onSubmit={async (e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				const validateResult = validateForm(formData);
				if (validateResult.success) {
					const { type, error } = await submitForm<{}, FormError>(
						e.currentTarget
					);
					setErrors(error);
					if (type === "resolved") setMessage("Success!");
				} else {
					setErrors(validateResult.error.flatten());
				}
			}}
		>
			<div>
				<label for="email">Email</label>
				<input
					type="text"
					name="email"
					id="email"
					required
					class="border"
					value={props.inputValues.email ?? ""}
				/>
				<Show when={errors()?.fieldErrors.email} keyed>
					{(val) => <ErrorMessage>{val.toString()}</ErrorMessage>}
				</Show>
			</div>
			<div class="mt-4">
				<label for="name">Name</label>
				<input
					type="text"
					name="name"
					id="name"
					class="border"
					value={props.inputValues.name ?? ""}
				/>
				<Show when={errors()?.fieldErrors.name} keyed>
					{(val) => <ErrorMessage>{val.toString()}</ErrorMessage>}
				</Show>
			</div>
			<div class="mt-4">
				<label for="isPromoAllowed">Include promotional emails</label>
				<input
					type="checkbox"
					name="isPromoAllowed"
					id="isPromoAllowed"
					checked={props.inputValues.isPromoAllowed ?? ""}
				/>
				<Show when={errors()?.fieldErrors.isPromoAllowed} keyed>
					{(val) => <ErrorMessage>{val.toString()}</ErrorMessage>}
				</Show>
			</div>
			<button type="submit" class="bg-black text-white my-2 px-2">
				Sign me up
			</button>
			<p class="text-green-500">{message()}</p>
		</form>
	);
};
