export const FIDELITY_PROMPTS = {
  faithful: 'Keep all geometry, openings, dimensions, materials, colors, camera, framing, layout and composition unchanged. Improve only photographic realism.',
  enhance: 'Keep all geometry, openings, dimensions, camera, framing, layout and composition unchanged. Refine lighting, material realism and photographic finish without redesigning the project.',
  creative: 'Keep geometry, openings, dimensions, camera and composition unchanged. Materials and visual styling may be reinterpreted according to the selected direction.',
  open: 'Keep the architectural intent and camera composition coherent. Visual changes and requested additional elements are allowed only when explicitly instructed.',
}

export const SPEED_PROMPTS = {
  fast: 'Prioritize a clear, coherent preview and fast generation.',
  balanced: 'Balance visual fidelity, instruction adherence and generation efficiency.',
  final: 'Prioritize maximum detail, material realism and presentation quality.',
}

export const LOCALIZED_EDIT_PROMPTS = {
  remove: 'Remove the content inside the white masked area and reconstruct the background naturally.',
  replace: 'Replace only the content inside the white masked area according to the edit instruction.',
  regenerate: 'Regenerate only the white masked area and blend it seamlessly with the unchanged image.',
}
