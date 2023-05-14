import cities from '../json/vietnam-address/cities.json';
import districts from '../json/vietnam-address/districts.json';
import wards from '../json/vietnam-address/wards.json';
import type { CityModel } from '../types/cityModel';
import type { DistrictModel } from '../types/districtModel';
import type { WardModel } from '../types/wardModel';

export const getCities = () => {
  return cities as unknown as CityModel[];
};

export const getDistricts = () => {
  return districts as unknown as DistrictModel[];
};

export const getWards = () => {
  return wards as unknown as WardModel[];
};
