import { createSlice } from "@reduxjs/toolkit";
import type { ProductRequest } from "@/types";
import data from "@/assets/data.json";

type ProductRequestsState = {
  entities: ProductRequest[];
};

const initialState: ProductRequestsState = {
  entities: data.productRequests as ProductRequest[],
};

const productRequestsSlice = createSlice({
  name: "productRequests",
  initialState,
  reducers: {},
});

export const productRequestsReducers = productRequestsSlice.reducer;

export default productRequestsSlice;
