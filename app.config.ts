const size = {
  '2xs': 'text-xs',
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const

export default defineAppConfig({
  menu_settings: [
    {
      label: 'Profile',
      icon: '',
      slot: 'profile',
      to: '/settings/profile',
      children: [],
    },
  ],
  menu: [
    {
      title: '',
    },
    {
      label: 'Dashboard',
      icon: 'i-ion-grid-sharp',
      slot: 'profile',
      to: '/admin/dashboard',
      children: [],
    },
    {
      label: 'Member',
      icon: 'i-ion-person-stalker',
      slot: 'member',
      to: '/admin/member',
      children: [],
    },
    {
      label: 'Catatan iuran',
      icon: 'i-ion-book',
      slot: 'iuran',
      to: '/admin/iuran',
      children: [],
    },
    {
      label: 'Ronda',
      icon: 'i-ion-ios-flashlight',
      slot: 'ronda',
      children: [
        {
          label: 'Jadwal',
          slot: 'ronda',
          to: '/admin/ronda/jadwal',
          children: [],
        },
        {
          label: 'jimpitan',
          slot: 'ronda',
          to: '/admin/ronda/jimpitan',
          children: [],
        },
      ],
    },
  ],
  Navbar: {
    container: 'dark:bg-gray-900 sm:pr-0 pr-5 bg-gray-50',
    childContainer: 'flex flex-wrap justify-between items-center p-4',
  },
  ui: {
    strategy: 'override',
    primary: 'blue',
    size: 'md',
    avatar: {
      background: 'bg-main-400 dark:bg-wood-800',
      text: 'font-medium leading-none text-white truncate',
      placeholder: 'font-medium leading-none text-white truncate',
    },
    input: {
      rounded: 'rounded-md',
      size,
      color: {
        white: {
          outline:
            'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-white ',
        },
      },
    },
    select: {
      rounded: 'rounded-md',
      size,
    },
    button: {
      font: 'font-normal',
      rounded: 'rounded-md',
      size,
      icon: {
        base: 'flex-shrink-0',
        size: {
          '2xs': 'h-3 w-3',
          xs: 'h-3.5 w-3.5',
          sm: 'h-4 w-4',
          md: 'h-4 w-4',
          lg: 'h-5 w-5',
          xl: 'h-6 w-6',
        },
      },
      color: {
        white: {
          outline: 'text-white ring-1 ring-inset ring-white',
        },
        'royal-blue': {
          ghost: 'text-black hover:bg-gray-200 dark:hover:bg-gray-800',
          solid:
            'text-gray-700 dark:text-gray-200 hover:text-white dark:hover:text-white hover:bg-blue-900 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
        },
        gray: {
          solid:
            'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
          ghost:
            'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
          link: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
        },
        link: {
          ghost: 'text-blue-500 no-underline hover:bg-transparent text-black',
        },
      },
      default: {
        loadingIcon: 'i-iconoir-system-restart',
        color: 'royal-blue',
        variant: 'ghost',
      },
    },

    table: {
      wrapper: 'relative',
      loadingState: {
        label: 'text-md text-center text-wood-400 dark:text-white',
        icon: 'w-10 h-10 mx-auto text-wood-400 dark:text-wood-400 mb-4 animate-spin',
      },
      emptyState: {
        label: 'text-md text-center text-wood-400 dark:text-white',
        icon: 'w-10 h-10 mx-auto text-wood-400 dark:text-wood-400 mb-4',
      },
      default: {
        loadingState: {
          icon: 'i-iconoir-system-restart',
          label: 'Loading...',
        },
        emptyState: {
          icon: 'i-iconoir-multiple-pages-empty',
          label: 'Data not available',
        },
      },
    },
    pagination: {
      wrapper: 'flex items-center -space-x-px',
      base: '',
      rounded: 'first:rounded-s-md last:rounded-e-md',
      default: {
        size: 'sm',
        activeButton: {
          color: 'primary',
        },
        inactiveButton: {
          color: 'white',
        },
        firstButton: {
          color: 'white',
          class: 'rtl:[&_span:first-child]:rotate-180',
          icon: 'i-heroicons-chevron-double-left-20-solid',
        },
        lastButton: {
          color: 'white',
          class: 'rtl:[&_span:last-child]:rotate-180',
          icon: 'i-heroicons-chevron-double-right-20-solid',
        },
        prevButton: {
          color: 'white',
          class: 'rtl:[&_span:first-child]:rotate-180 me-5',
          icon: 'i-heroicons-chevron-left-20-solid',
        },
        nextButton: {
          color: 'white',
          class: 'rtl:[&_span:last-child]:rotate-180',
          icon: 'i-heroicons-chevron-right-20-solid',
        },
      },
    },
    notifications: {
      position: 'top-0 right-0',
    },
    modal: {
      overlay: {
        background: 'backdrop-brightness-75',
      },
      container: 'flex min-h-full  items-center justify-center text-center',
    },
  },
})
