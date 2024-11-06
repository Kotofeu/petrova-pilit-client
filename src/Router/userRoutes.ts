import Home from '../pages/Home';
import AboutMe from '../pages/AboutMe';
import Works from '../pages/Works';
import Work from '../pages/Work';
import Reviews from '../pages/Reviews';
import Policy from '../pages/Policy';
import Settings from '../pages/Settings';
import User from '../pages/User';
import Users from '../pages/Users';
import Admin from '../pages/Admin';
import {
    ABOUT_ROUTE,
    ADMIN_ROUTE,
    HOME_ROUTE,
    POLICY_ROUTE,
    REVIEWS_ROUTE,
    SETTINGS_ROUTE,
    USER_ROUTE,
    WORKS_ROUTE,
} from '../utils/const/routes';

export const authRoutes = [
    { path: SETTINGS_ROUTE, Component: Settings },
];

export const publicRoutes = [
    { path: HOME_ROUTE, Component: Home },
    { path: ABOUT_ROUTE, Component: AboutMe },
    { path: WORKS_ROUTE, Component: Works },
    { path: WORKS_ROUTE + '/:id', Component: Work },
    { path: REVIEWS_ROUTE, Component: Reviews },
    { path: POLICY_ROUTE, Component: Policy },
];

export const adminRoutes = [
    { path: ADMIN_ROUTE, Component: Admin },
    { path: USER_ROUTE, Component: Users },
    { path: USER_ROUTE + '/:id', Component: User },
];