import React from 'react';
import RegisterModal from './RegisterModal';
import PostModal from './PostModal';
import EditPostModal from './EditPostModal';
import { usePrivateModalContext, usePublicModalContext } from '../../contexts';

export const ModalManager = () => {
   const { modalType: publicModalType, showModal: showPublicModal } = usePublicModalContext();
   const { modalType: privateModalType, showModal: showPrivateModal } = usePrivateModalContext();

   return (
      <>
         {showPublicModal && publicModalType === 'register' && <RegisterModal />}
         {showPrivateModal && privateModalType === 'post' && <PostModal />}
         {showPrivateModal && privateModalType === 'editPost' && <EditPostModal />}
      </>
   );
};
