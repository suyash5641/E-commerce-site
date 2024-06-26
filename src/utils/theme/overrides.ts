import { Components, Theme } from "@mui/material";

export const minor = () => {
  const config: Components = {
    // MuiButton: {
    //     defaultProps: {
    //         variant: 'contained',
    //         sx: {
    //             textTransform: 'capitalize',
    //         },
    //     },
    //     styleOverrides: {
    //         root: {
    //             boxShadow: 'none',
    //             padding: `${theme.spacing(2)} ${theme.spacing(2.2)}`,
    //             minWidth: theme.spacing(18),
    //         },
    //         contained: {
    //             backgroundColor: theme.palette.grey.A400,
    //             border: `2px solid transparent`,
    //         },
    //         outlined: {
    //             border: `2px solid ${theme.palette.grey.A400}`,
    //         },
    //         sizeLarge: {
    //             fontSize: 24,
    //         },
    //     },
    // },
    // MuiTab: {
    //     styleOverrides: {
    //         root: {
    //             fontWeight: 'normal',
    //             '&.Mui-selected': { fontWeight: 'bold' },
    //         },
    //     },
    //     defaultProps: {
    //         sx: {
    //             textTransform: 'capitalize',
    //             fontSize: 40,
    //         },
    //     },
    // },
    // MuiGrid: {
    //     defaultProps: {
    //         container: true,
    //     },
    // },

    // MuiOutlinedInput: {
    //     styleOverrides: {
    //         root: {
    //             input: {
    //                 padding: theme.spacing(3),
    //             },
    //             fieldset: { borderWidth: 4 },
    //         },
    //     },
    // },
    // MuiSelect: {
    //     styleOverrides: {
    //         select: {
    //             padding: theme.spacing(3),
    //         },
    //     },
    // },
    // MuiCheckbox: {
    //     styleOverrides: {
    //         root: {},
    //     },
    // },
    MuiModal: {
      styleOverrides: {
        root: {
          outline: "none",
        },
      },
    },
    //  MuiPaper: {
    //     styleOverrides: {
    //         root: {
    //             borderRadius:"16px"
    //         },
    //     },
    // },
    MuiInput: {
      styleOverrides: {
        root: {
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          width: "85%",
          margin: "20px 16px 20px 17px",
        },
        thumb: {
          color: "white",
        },
        track: {
          color: "red",
        },
        rail: {
          color: "grey",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: "center",
        },
        message: {
          overflow: "hidden",
          textAlign: "center",
          textOverflow: "ellipsis",
        },
      },
    },
  };
  return config;
};

export const overrides = () => {
  const overrides: Components = {
    ...minor(),
  };
  return overrides;
};
