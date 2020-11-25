import firebase from 'firebase';
import { firestore, functions } from 'src/firebase';
import {
  Request,
  RequestFirestoreConverter,
  RequestStatus,
} from 'src/models/requests';
import { AbstractRequestStatus } from 'src/models/requests/RequestWithOffersAndTimeline';
import { ApplicationPreference } from 'src/models/users';

import { IgetRequestPosts } from './types';

export const observeRequestPosts = (
  nextValue: Function,
  payload: IgetRequestPosts,
): firebase.Unsubscribe => {
  let initialQuery = firestore
    .collection('requests')
    .where('status', '==', RequestStatus.pending);

  if (payload.userType === ApplicationPreference.pin) {
    initialQuery = initialQuery.where('pinUserRef', '==', payload.userRef);
  }

  return initialQuery
    .withConverter(RequestFirestoreConverter)
    .onSnapshot(snap => nextValue(snap));
};

export const createUserRequest = async ({
  requestPayload,
}: {
  requestPayload: Request;
}) =>
  firestore
    .collection('requests')
    .doc()
    .withConverter(RequestFirestoreConverter)
    .set(requestPayload);

export const setUserRequest = async ({
  requestPayload,
  requestId,
}: {
  requestPayload: Request;
  requestId: string;
}) =>
  firestore
    .collection('requests')
    .doc(requestId)
    .withConverter(RequestFirestoreConverter)
    .set(requestPayload);

export const getOpenPost = async ({ lat, lng }: IgetRequestPosts) =>
  functions.httpsCallable('https-api-requests-getRequests')({
    lat,
    lng,
    radius: 500,
    status: AbstractRequestStatus.pending,
  });

export const getAcceptedPost = async ({ lat, lng }: IgetRequestPosts) =>
  functions.httpsCallable('https-api-requests-getRequests')({
    lat,
    lng,
    radius: 5,
    status: AbstractRequestStatus.accepted,
  });

export const getOngoingPost = async ({ lat, lng }: IgetRequestPosts) =>
  functions.httpsCallable('https-api-requests-getRequests')({
    lat,
    lng,
    radius: 5,
    status: AbstractRequestStatus.ongoing,
  });

export const getFinishedRequest = async ({ lat, lng }: IgetRequestPosts) =>
  functions.httpsCallable('https-api-requests-getRequests')({
    lat,
    lng,
    radius: 5,
    status: AbstractRequestStatus.finished,
  });

export const getArchivedRequest = async ({ lat, lng }: IgetRequestPosts) =>
  functions.httpsCallable('https-api-requests-getRequests')({
    lat,
    lng,
    radius: 5,
    status: AbstractRequestStatus.archived,
  });
