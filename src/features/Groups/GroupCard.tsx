import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteButton } from '../../components/DeleteButton';
import { ConfirmModal } from '../../components/ConfirmModal';
import { groupApi } from '../../shared/api/groupApi';
import { Error } from '../../components/Error';
import { useAppDispatch } from '../../app/hooks';
import { removeGroup } from './groupsSlice';

interface GroupCardProps {
  id: number;
  name: string;
}

export const GroupCard: React.FC<GroupCardProps> = ({ id, name }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string | null>(null);

  const handleNavigate = () => {
    navigate(`/chat/${id}`);
  };

  const handleGroupDelete = async () => {
    setLoadingDelete(true);
    setErrorDelete(null);

    try {
      await groupApi.deleteGroup(id);
      dispatch(removeGroup(id));
    } catch (error) {
      if (typeof error === 'string') {
        setErrorDelete(error);
      } else {
        setErrorDelete('Ошибка обновления данных');
      }
    }

    setShowDeleteModal(false);
    setLoadingDelete(false);
  };

  return (
    <>
      <div className="card shadow-sm h-100" style={{ width: '12rem' }}>
        <div className="d-flex align-items-center justify-content-center mt-2">
          <img
            src="/src/assets/ai.svg"
            alt="Group"
            style={{ width: '100px', height: '100px' }}
          />
        </div>
        <div className="card-body d-flex flex-column justify-content-between p-2 text-center">
          <h6 className="card-title">{name}</h6>
          <div className="d-flex align-items-center justify-content-center mt-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleNavigate}
            >
              Перейти
            </button>
            <DeleteButton onClick={() => setShowDeleteModal(true)} />
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удаление чата"
        body="Вы уверены, что хотите удалить этот чат?"
        onConfirm={handleGroupDelete}
        loading={loadingDelete}
      />

      {errorDelete && <Error message={errorDelete} />}
    </>
  );
};
