export async function POST(req){
  const {language,code} = await req.json();

  // send to docker container
  // execute
  // return output

  return Response.json({output:"Hello"});
}
