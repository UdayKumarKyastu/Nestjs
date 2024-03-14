export interface Recipe {
  product_no: number
  product_category_no: number
  product_subcategory_no: number
  plu_primary_category_no: number
  plu_secondary_category_no: number
  product_name: string
  plu_reporting_name: string
  is_made_to_sell: boolean
  allow_carry_over: boolean
  allow_shop_transfer: boolean
  allow_delivery: boolean
  allow_staff_food: boolean
  allow_shop_waste: boolean
  is_platter: boolean
  is_slim_pret: boolean
  slim_pret_parent_product_no: number
  live_from_date: string
  live_to_date: string
  minimum_per_bench: number | null
  maximum_per_bench: number | null
  unit_transfer_price: number | null
  similar_product_no: number | null
  similar_product_sales_percent: number | null
  requested_synchronisation_date: string
  is_synchronised: boolean
  synchronisation_requested_by: string
  actual_synchronisation_date: string
  actual_synchronisation_by: string
  last_updated_by: string
  last_updated_date: string
  recipe_modified: boolean
  unit_net_price_for_cogs: number
  production_times_modified: boolean
  reporting_name: null
  external_pret_id: string
}

export interface UnitOfMeasure {
  unit_id: string
  is_base_unit: boolean
  unit_type_id: string
  factor: number
  is_current: boolean
}

export interface Good {
  goods_no: number
  goods_category_no: number
  supplier_goods_category_no: number
  stock_reporting_category_no: number
  ordered_by_shop_role_id: string
  stock_unit_id: string
  label_unit_id: string
  goods_name: string
  is_transferable: boolean
  shelf_life_once_opened: number
  live_from_date: string
  live_to_date: string
  enable_order_reminder: boolean
  stock_count_type: string
  enable_order_quantity_check: boolean
  not_delivered_days_of_week: string
  not_delivered_from_date: string
  not_delivered_to_date: string
  stock_take_frequency: string
  shelf_life_into_shops: number
  treat_as_if_in_recipe: boolean
  requested_synchronisation_date: string
  is_synchronised: boolean
  synchronisation_requested_by: string
  actual_synchronisation_date: string
  actual_synchronisation_by: string
  last_updated_by: string
  last_updated_date: string
  reorder_calculation_no: number
  delist_waste_type_no: number
  reporting_name: string | null
  external_pret_id: string | null
}

export interface GoodPackSize {
  goods_no: number
  supplier_no: number
  unit_id: string
  pack_size: number
  supplier_product_code: string
  supplier_sort_order: number
  allow_special_return: boolean
  is_in_use: boolean
  is_main_pack_size: boolean
  is_split_case: boolean
  old_starkis_unit_name: string | null
  not_delivered_days_of_week: string | null
  not_delivered_from_date: string | null
  not_delivered_to_date: string | null
  requested_synchronisation_date: string
  is_synchronised: boolean
  synchronisation_requested_by: string
  actual_synchronisation_date: string
  actual_synchronisation_by: string
  last_updated_by: string
  last_updated_date: string
}

export interface GoodPackPrice {
  goods_no: number
  supplier_no: number
  unit_id: string
  pack_size: number
  effective_date: string
  until_date: string | null
  pack_price: number
  distribution_cost: number
}
