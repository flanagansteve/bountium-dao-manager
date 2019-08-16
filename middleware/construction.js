export default function({ route, redirect }) {
  return redirect(302, `/business/${route.params.contract}`)
}
