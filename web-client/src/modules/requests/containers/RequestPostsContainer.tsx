import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ProfileState } from 'src/ducks/profile/types';
import {
  getRequestPosts,
  resetRequestPostState,
} from 'src/ducks/requests/actions';
import { PostState } from 'src/ducks/requests/types';
import { ApplicationPreference } from 'src/models/users';
import { TimelineViewLocation } from 'src/modules/timeline/constants';

import LoadingWrapper from '../../../components/LoadingComponent/LoadingComponent';
import {
  InformationModal,
  makeLocalStorageKey,
} from '../../../components/Modals/OneTimeModal';
import Header from '../components/Header';
import RequestList from '../components/RequestList';
import RequestPostItem from '../components/RequestPostItem';
import { PostTabsType } from '../constants';

const RequestPostsContainer: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const profileState = useSelector(
    ({ profile }: { profile: ProfileState }) => profile,
  );
  // TODO: console.log('before', profileState.url);
  // profileState.url = window.location.href;
  // console.log('after', profileState.url);

  const requestWithOffersAndTimeline = useSelector(
    ({ requests }: { requests: PostState }) => requests.syncRequestPostsState,
  );

  const path = history.location.pathname;
  const isRequestTab = path.includes(PostTabsType.requests);

  useEffect(() => {
    if (isRequestTab) {
      dispatch(resetRequestPostState());
    }
  }, [isRequestTab, dispatch]);

  useEffect(() => {
    if (isRequestTab && profileState.profile?.applicationPreference) {
      dispatch(
        getRequestPosts({
          userType: profileState.profile.applicationPreference,
          userRef: profileState.userRef,
        }),
      );
    }
  }, [profileState, isRequestTab, dispatch]);

  const handleRequest: Function = id =>
    history.push(TimelineViewLocation.toUrl({ requestId: id }));

  const toCloseRequest: Function = id => `Fill logic: Remove request ${id}`;

  if (
    !requestWithOffersAndTimeline.data ||
    requestWithOffersAndTimeline.loading
  ) {
    return <LoadingWrapper />;
  }

  const instructions = [
    t('information_modal.OpenRequestsContainer.0'),
    t('information_modal.OpenRequestsContainer.1'),
    t('information_modal.OpenRequestsContainer.2'),
  ];
  const instructionModalLocalStorageKey = makeLocalStorageKey({
    prefix: 'reach4help.modalSeen.OpenRequestsContainer',
    userid: profileState.uid,
  });

  return (
    <>
      <Header
        requestsType={t(
          'modules.requests.containers.OpenRequestContainer.open',
        )}
        numRequests={
          Object.keys(requestWithOffersAndTimeline.data || {}).length
        }
        isCav={
          profileState.profile?.applicationPreference ===
          ApplicationPreference.cav
        }
        isAcceptedRequests={false}
      />
      <RequestList
        requests={requestWithOffersAndTimeline.data}
        loading={
          requestWithOffersAndTimeline && requestWithOffersAndTimeline.loading
        }
        handleRequest={handleRequest}
        isCavAndOpenRequest={false}
        isPinAndOpenRequest={
          profileState.profile?.applicationPreference ===
          ApplicationPreference.pin
        }
        RequestItem={RequestPostItem}
        toCloseRequest={toCloseRequest}
      />
      <InformationModal
        title={t('information_modal.OpenRequestsContainer.title')}
        localStorageKey={instructionModalLocalStorageKey}
        instructions={instructions}
      />
    </>
  );
};

export default RequestPostsContainer;
