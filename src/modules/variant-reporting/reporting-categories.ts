import { ReportingCategoryOption } from '../product/logic/models/reporting-category-option'

export class ReportingCategories {
  static PluCategoriesOptionsTree: ReportingCategoryOption[] = [
    {
      key: 'ColdDrinks',
      label: 'COLD DRINKS',
      children: [
        {
          key: 'Juices',
          label: 'JUICES',
        },
        {
          key: 'Water',
          label: 'WATER',
        },
        {
          key: 'IcedDrinksMts',
          label: 'ICED DRINKS (MTS)',
        },
        {
          key: 'Coke',
          label: 'COKE',
        },
        {
          key: 'PurePretStills',
          label: 'PURE PRET STILLS',
        },
        {
          key: 'PurePretCans',
          label: 'PURE PRET CANS',
        },
        {
          key: 'ReadyToDrinkCoffee',
          label: 'READY TO DRINK COFFEE',
        },
      ],
    },
    {
      key: 'Snacks',
      label: 'SNACKS',
      children: [
        {
          key: 'WholeFruit',
          label: 'WHOLE FRUIT',
        },
        {
          key: 'CrispsAndChips',
          label: 'CRISPS/CHIPS',
        },
        {
          key: 'PretPots',
          label: 'PRET POTS',
        },
        {
          key: 'Bars',
          label: 'BARS',
        },
        {
          key: 'FruitPots',
          label: 'FRUIT POTS',
        },
        {
          key: 'Cakes',
          label: 'CAKES',
        },
        {
          key: 'Popcorn',
          label: 'POPCORN',
        },
        {
          key: 'MiniPacks',
          label: 'MINI PACKS',
        },
        {
          key: 'HotBreakfastPots',
          label: 'HOT BREAKFAST POTS',
        },
      ],
    },
    {
      key: 'HotDrinks',
      label: 'HOT DRINKS',
      children: [
        {
          key: 'Tea',
          label: 'TEA',
        },
        {
          key: 'Syrups',
          label: 'SYRUPS',
        },
        {
          key: 'HotChocolate',
          label: 'HOT CHOCOLATE',
        },
        {
          key: 'Coffee',
          label: 'COFFEE',
        },
      ],
    },
    {
      key: 'Sandwiches',
      label: 'SANDWICHES',
      children: [
        {
          key: 'ColdBreakfastSandwiches',
          label: 'COLD BREAKFAST SANDWICHES',
        },
        {
          key: 'ColdWraps',
          label: 'COLD WRAPS',
        },
        {
          key: 'Granary',
          label: 'GRANARY',
        },
        {
          key: 'Toasties',
          label: 'TOASTIES',
        },
        {
          key: 'NonGranary',
          label: 'NON GRANARY',
        },
        {
          key: 'HotBreakfastSandwiches',
          label: 'HOT BREAKFAST SANDWICHES',
        },
        {
          key: 'HotWraps',
          label: 'HOT WRAPS',
        },
        {
          key: 'Baguettes',
          label: 'BAGUETTES',
        },
        {
          key: 'ColdLunchRoll',
          label: 'COLD LUNCH ROLL',
        },
        {
          key: 'FocacciaPizzas',
          label: 'FOCACCIA PIZZAS',
        },
        {
          key: 'SlimBaguettes',
          label: 'SLIM BAGUETTES',
        },
      ],
    },
    {
      key: 'Other',
      label: 'OTHER',
      children: [
        {
          key: 'DeliveryNonSandwiches',
          label: 'DELIVERY NON SANDWICHES',
        },
        {
          key: 'DeliverySandwiches',
          label: 'DELIVERY SANDWICHES',
        },
        {
          key: 'Other',
          label: 'Other',
        },
        {
          key: 'DeliveryDrinks',
          label: 'DELIVERY DRINKS',
        },
      ],
    },
    {
      key: 'Bakery',
      label: 'BAKERY',
      children: [
        {
          key: 'MuffinsAndCookies',
          label: 'MUFFINS & COOKIES',
        },
        {
          key: 'SavouryCroissanterie',
          label: 'SAVOURY CROISSANTERIE',
        },
        {
          key: 'SweetCroissanterie',
          label: 'SWEET CROISSANTERIE',
        },
      ],
    },
    {
      key: 'NonSandwiches',
      label: 'NON SANDWICHES',
      children: [
        {
          key: 'SaladPots',
          label: 'SALAD POTS',
        },
        {
          key: 'SoupMedium',
          label: 'SOUP MEDIUM',
        },
        {
          key: 'SaladsDressings',
          label: 'SALADS DRESSINGS',
        },
        {
          key: 'SoupBread',
          label: 'SOUP BREAD',
        },
        {
          key: 'Salads',
          label: 'SALADS',
        },
        {
          key: 'SoupSmall',
          label: 'SOUP SMALL',
        },
        {
          key: 'SoupOther',
          label: 'SOUP OTHER',
        },
        {
          key: 'OtherHotFood',
          label: 'OTHER HOT FOOD',
        },
        {
          key: 'Other',
          label: 'Other',
        },
      ],
    },
  ]

  static StarKisCategoryOptionsTree: ReportingCategoryOption[] = [
    {
      key: 'Cookies',
      label: 'COOKIES',
      children: [
        {
          key: 'Cookies',
          label: 'COOKIES',
        },
      ],
    },
    {
      key: 'Platters',
      label: 'PLATTERS',
      children: [
        {
          key: 'Platters',
          label: 'PLATTERS',
        },
      ],
    },
    {
      key: 'HotDrinks',
      label: 'HOT DRINKS',
      children: [
        {
          key: 'Misc',
          label: 'MISC',
        },
        {
          key: 'HotDrinks',
          label: 'HOT DRINKS',
        },
      ],
    },
    {
      key: 'Fruit',
      label: 'FRUIT',
      children: [
        {
          key: 'Fruit',
          label: 'FRUIT',
        },
      ],
    },
    {
      key: 'Soup',
      label: 'SOUP',
      children: [
        {
          key: 'Soup',
          label: 'SOUP',
        },
      ],
    },
    {
      key: 'PretWraps',
      label: 'PRETWRAPS',
      children: [
        {
          key: 'PretWraps',
          label: 'PRETWRAPS',
        },
        {
          key: 'MonthlySpecial',
          label: 'MONTHLY SPECIAL',
        },
      ],
    },
    {
      key: 'CPG',
      label: 'CPG',
      children: [
        {
          key: 'CPG',
          label: 'CPG',
        },
      ],
    },
    {
      key: 'ColdDrinks',
      label: 'COLD DRINKS',
      children: [
        {
          key: 'ColdDrinks',
          label: 'COLD DRINKS',
        },
      ],
    },
    {
      key: 'Salads',
      label: 'SALADS',
      children: [
        {
          key: 'Salads',
          label: 'SALADS',
        },
      ],
    },
    {
      key: 'Misc',
      label: 'MISC',
      children: [
        {
          key: 'Misc',
          label: 'MISC',
        },
      ],
    },
    {
      key: 'PretCrisps',
      label: 'PRET CRISPS',
      children: [
        {
          key: 'PretCrisps',
          label: 'PRET CRISPS',
        },
      ],
    },
    {
      key: 'PretNetFood',
      label: 'PRETNET FOOD',
      children: [
        {
          key: 'PretNetFood',
          label: 'PRETNET FOOD',
        },
      ],
    },
    {
      key: 'Baguettes',
      label: 'BAGUETTES',
      children: [
        {
          key: 'Baguettes',
          label: 'BAGUETTES',
        },
        {
          key: 'MonthlySpecial',
          label: 'MONTHLY SPECIAL',
        },
      ],
    },
    {
      key: 'KidsRange',
      label: 'KIDS RANGE',
      children: [
        {
          key: 'KidsRange',
          label: 'KIDS RANGE',
        },
      ],
    },
    {
      key: 'Sandwiches',
      label: 'SANDWICHES',
      children: [
        {
          key: 'Granary',
          label: 'GRANARY',
        },
        {
          key: 'SpecialityBread',
          label: 'SPECIALITY BREAD',
        },
        {
          key: 'ColdLunchRoll',
          label: 'COLD LUNCH ROLL',
        },
      ],
    },
    {
      key: 'Croissant',
      label: 'CROISSANT',
      children: [
        {
          key: 'Croissant',
          label: 'CROISSANT',
        },
      ],
    },
    {
      key: 'HotFood',
      label: 'HOT FOOD',
      children: [
        {
          key: 'SpecialityBread',
          label: 'SPECIALITY BREAD',
        },
        {
          key: 'HotFood',
          label: 'HOT FOOD',
        },
        {
          key: 'FocacciaPizzas',
          label: 'FOCACCIA PIZZAS',
        },
      ],
    },
    {
      key: 'CakesAndPuddings',
      label: 'CAKES & PUDDINGS',
      children: [
        {
          key: 'CakesAndPuddings',
          label: 'CAKES & PUDDINGS',
        },
      ],
    },
  ]
}
