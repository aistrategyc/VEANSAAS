export function formatAttributes(data, services, service, selectedServiceUuid) {
	const serviceAttributes =
		service?.category?.attributes ||
		services?.find(s => s.uuid === selectedServiceUuid)?.category?.attributes ||
		[]

	return data.attributes.map((attr, index) => {
		const attribute = serviceAttributes[index]

		if (!attribute) return attr

		if (attribute.type === 'select') {
			return {
				attribute_uuid: attr.attribute_uuid,
				option_uuid: attr.option_uuid,
			}
		}

		return {
			attribute_uuid: attr.attribute_uuid,
			value: String(attr.value ?? ''),
		}
	})
}
