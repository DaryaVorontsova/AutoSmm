import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { LinkForm } from '../features/Groups/LinkForm';
import { NoLinkForm } from '../features/Groups/NoLinkForm';
import { GroupsList } from '../features/Groups/GroupsList';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectGroups,
  selectGroupsErrorAdd,
  selectGroupsLoadingAdd,
  selectGroupsError,
  selectGroupsLoading,
} from '../features/Groups/groupsSelectors';
import { selectIsAuthenticated } from '../features/Auth/authSelectors';
import type { myFormData } from '../features/Groups/types';
import {
  fetchGroups,
  addGroup,
  addGroupNoLink,
} from '../features/Groups/groupsThunks';

export const StartPage: React.FC = () => {
  const [noLink, setNoLink] = useState(false);
  const dispatch = useAppDispatch();
  const groups = useAppSelector(selectGroups);
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const loadingGroups = useAppSelector(selectGroupsLoading);
  const errorGroups = useAppSelector(selectGroupsError);
  const loadingAdd = useAppSelector(selectGroupsLoadingAdd);
  const errorAdd = useAppSelector(selectGroupsErrorAdd);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(fetchGroups());
    }
  }, [isAuthenticated, dispatch, navigate]);

  const handleSubmit = (link?: string) => {
    if (!link) {
      return;
    }

    dispatch(addGroup(link));
  };

  const handleSubmitNolink = async (formData: myFormData) => {
    if (!formData) {
      return;
    }

    dispatch(addGroupNoLink(formData));
  };

  return (
    <>
      <Header />
      <div className="container text-center mt-4">
        <p className="text-muted">
          AutoSMM — это ваш персональный помощник в управлении сообществами.
          Добавляйте группы, следите за их активностью и автоматизируйте работу,
          чтобы освободить время для важных дел. Здесь нет места скуке — только
          удобные инструменты, лёгкость и немного магии цифрового мира!
        </p>

        {!noLink && (
          <LinkForm
            onSubmit={handleSubmit}
            loading={loadingAdd}
            error={errorAdd}
          />
        )}

        <div className="form-check d-flex justify-content-center mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="noLinkCheck"
            checked={noLink}
            onChange={() => setNoLink(!noLink)}
            disabled={loadingAdd}
          />
          <label className="form-check-label ms-2" htmlFor="noLinkCheck">
            У меня нет ссылки
          </label>
        </div>

        {noLink && (
          <NoLinkForm
            loading={loadingAdd}
            error={errorAdd}
            onSubmit={handleSubmitNolink}
          />
        )}
        <h3 className="mt-4 mb-3">История ваших чатов</h3>
        <GroupsList
          groups={groups}
          loading={loadingGroups}
          error={errorGroups}
        />
      </div>
    </>
  );
};
