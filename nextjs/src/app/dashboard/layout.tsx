"use client";
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Drawer, Typography, Divider, ListItem, ListItemButton, ListItemText, Box, Avatar, Paper, IconButton } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Provider from "./Provider";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Theme } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession() as { data: session; status: string };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isWideScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  type menuItem = {
    name: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    path: string;
  };
  type menuItems = {
    div1: menuItem[];
    div2: menuItem[];
  };
  type session = {
    user: {
      name: string;
    };
  };

  const MenuItems: menuItems = {
    div1: [
      {
        name: "Dashboard",
        path: "/dashboard",
      },
      {
        name: "Manage Shifts",
        path: "/dashboard/manage-shifts",
      },
      {
        name: "Tasks",
        path: "/dashboard/tasks",
      },
      {
        name: "Users",
        path: "/dashboard/users",
      },
      {
        name: "API Tester",
        path: "/test-api",
      },
    ],
    div2: [
      {
        name: "Logout",
        onClick: (e) => {
          e.preventDefault();
          signOut();
        },
        path: "/api/auth/signout",
      },
    ],
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <>
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 64,
            height: 64,
          }}
        />
        <Typography variant="h6" noWrap component="div">
          {status === "loading" ? "..." : status === "unauthenticated" ? "Not signed in" : session.user.name}
        </Typography>
      </Box>

      {Object.keys(MenuItems).map((key) => (
        <React.Fragment key={key}>
          <Divider />
          {MenuItems[key as keyof menuItems].map((item) => (
            <ListItem disablePadding dense key={item.path}>
              <ListItemButton
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#1f2c33",
                  },
                }}
                selected={pathname === item.path}
                onClick={(e) => {
                  if (item.onClick) item.onClick(e);
                  setDrawerOpen(false);
                }}
                href={item.path}
                LinkComponent={Link}
              >
                <ListItemText primaryTypographyProps={{ fontSize: "1rem" }} primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#101719",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar variant="dense">
          <Typography variant="h5" noWrap component="div">
            Residence Life Operations Administration Dashboard
          </Typography>
          {!isWideScreen && (
            <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle} sx={{ marginLeft: "auto" }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {isWideScreen ? (
        <Drawer
          variant="permanent"
          color="primary"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              backgroundColor: (theme) => {
                if (theme.palette.mode === "dark") {
                  return "#283641";
                }
                return "#efe8e6";
              },
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          color="primary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              backgroundColor: (theme) => {
                if (theme.palette.mode === "dark") {
                  return "#283641";
                }
                return "#efe8e6";
              },
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Provider>
        <Paper
          sx={{
            backgroundColor: "#ebf1f6",
            color: "#3c4954",
            flexGrow: 1,
            display: "flex",
            alignSelf: "flex-end",
            flexDirection: "column",
            alignItems: "center",
            padding: isWideScreen ? "5rem 5rem 2rem 3rem" : "4rem 2rem 2rem 2rem",
            overflow: "auto",
            width: isWideScreen ? "calc(100% - 240px)" : "100%",
          }}
          elevation={0}
        >
          {children}
        </Paper>
      </Provider>
    </>
  );
}
