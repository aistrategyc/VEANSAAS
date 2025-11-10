export const transformToValueLabel = (
	array = [],
	valueKey = 'uuid',
	labelKey = 'name'
) => {
	return array.map(item => ({
		...item,
		value: item[valueKey],
		label: item[labelKey],
	}))
}

