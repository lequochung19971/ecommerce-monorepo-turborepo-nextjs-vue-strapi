import cities from './cities.json';
import districts from './districts.json';
import wards from './wards.json';
import type { CityModel } from './cityModel';
import type { DistrictModel } from './districtModel';
import type { WardModel } from './wardModel';

export const getCities = () => {
  return cities as unknown as CityModel[];
};

export const getDistricts = () => {
  return districts as unknown as DistrictModel[];
};

export const getWards = () => {
  return wards as unknown as WardModel[];
};
