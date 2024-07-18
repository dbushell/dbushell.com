import type {DinoHandle} from 'dinossr';
import type {Data} from '@src/types.ts';
import {authorized, dateParts} from '@src/shared.ts';
import {manifest} from '@src/manifest.ts';

export const pattern = '/:slug(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}Z)/';

export const GET: DinoHandle<Data> = ({request, match}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  const {slug} = match.pathname.groups;
  const props = manifest.notes.find((props) => props.href.endsWith(`/${slug}/`));
  const {HH, mm, dd, D, MMM, YYYY} = dateParts(props!.date);
  if (props) {
    return Response.json({
      ...props,
      title: `Notes – ${HH}:${mm} ${dd} ${D} ${MMM} ${YYYY}`,
      latest: manifest.latest
    });
  }
  return new Response(null, {status: 400});
};
