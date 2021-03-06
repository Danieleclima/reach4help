import Location from 'react-app-location';
import * as Yup from 'yup';

export const postUrlRoot = '/list';

export enum PostTabsType {
  requests = 'requests',
  offers = 'offers',
}

export const FindRequestsLocation = new Location(`${postUrlRoot}/find`);
export const MyPostsLocation = new Location(`${postUrlRoot}/my/:postType`, {
  postType: Yup.string().required(),
});

export const MyOfferPostsLocationUrl = MyPostsLocation.toUrl({
  postType: PostTabsType.offers,
});
export const MyRequestPostsLocationUrl = MyPostsLocation.toUrl({
  postType: PostTabsType.requests,
});
