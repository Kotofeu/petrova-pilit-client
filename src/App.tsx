import { useEffect } from "react";
import { AuthResponse, contactApi, IMainInfoValue, mainInfoApi, userApi, workScheduleApi } from "./http";
import { Router } from "./Router";
import { applicationStore, IContactLink, IGetAllJSON, IWorkSchedule, userStore } from "./store";
import './styles/reset.scss'
import useRequest from "./utils/hooks/useRequest";
import { useMessage } from "./modules/MessageContext";
function App() {
  const { addMessage } = useMessage()

  const [
    user,
  ] = useRequest<AuthResponse>(userApi.refresh);

  const [
    workSchedule,
    _w,
    workScheduleError
  ] = useRequest<IWorkSchedule[]>(workScheduleApi.getWorkSchedule);

  const [
    contacts,
    _c,
    contactsError
  ] = useRequest<IGetAllJSON<IContactLink>>(contactApi.getContacts);

  const [
    mainInfo,
    _i,
    mainInfosError
  ] = useRequest<IMainInfoValue>(mainInfoApi.getInfos);

  const handleError = (error: string | null) => {
    if (error && error !== applicationStore.error) {
      applicationStore.setError(error);
      addMessage(error, 'error');
    }
  };

  useEffect(() => {
    handleError(mainInfosError);
    if (mainInfo) {
      applicationStore.setGeneralData(mainInfo);
    }
  }, [mainInfo, mainInfosError]);
  useEffect(() => {
    if (user?.user) {
      userStore.setUser(user.user);
    }
  }, [user]);
  useEffect(() => {
    if (workSchedule?.length) {
      applicationStore.setWorkSchedule(workSchedule);
    }
    handleError(workScheduleError);
  }, [workSchedule, workScheduleError]);

  useEffect(() => {
    if (contacts?.rows.length) {
      applicationStore.setContactsLinks(contacts.rows);
    }
    handleError(contactsError);
  }, [contacts, contactsError]);
  return (
    <Router />
  );
}

export default App;
