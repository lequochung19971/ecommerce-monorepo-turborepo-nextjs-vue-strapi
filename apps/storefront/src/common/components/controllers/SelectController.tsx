import type { Props as SelectProps } from 'chakra-react-select';
import { Select } from 'chakra-react-select';
import { Controller, useFormContext } from 'react-hook-form';
type SelectControllerProps = SelectProps & {
  name: string;
  modelToView?: (value: any) => any;
  viewToModel?: (value: any) => any;
};

export const SelectController: React.FunctionComponent<SelectControllerProps> = (props) => {
  const { modelToView, viewToModel } = props;
  const { control } = useFormContext();
  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          {...props}
          value={typeof modelToView === 'function' ? modelToView(field.value) : field.value}
          onChange={(newValue, actionMeta) => {
            const finalValue = typeof viewToModel === 'function' ? viewToModel(newValue) : newValue;
            field.onChange(finalValue);
            props.onChange?.(finalValue, actionMeta);
          }}
        />
      )}
    />
  );
};

export default SelectController;
