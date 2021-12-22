import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const Dropdown = (props) => {
    const {id, label, error, value, items, disabled, onChange} = props;
    return <FormControl fullWidth error={error}>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
            disabled={disabled}
            labelId={id}
            value={value}
            label={label}
            onChange={onChange}
        >
            {items.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </Select>
    </FormControl>
};
export { Dropdown };