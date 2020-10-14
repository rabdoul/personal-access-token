// tag::mapping[]
const ACTIVITIES_MAPPING: Record<string, string> = {
    "Analyse product order" : "analyse-product-order",
    "Personalize" : "personalize",
    "Setup sequencing" : "setup-sequencing",
    "Validate MTM Product" : "validate-mtm-product",
    "Generate batch" : "generate-batch",
    "Generate cutting order" : "generate-cutting-order",
    "Validate marker width" : "validate-marker-width",
    "Generate section plan" : "generate-section-plan",
    "Generate marker" : "generate-marker",
    "Validate marker" : "validate-marker",
    "After Nesting Roll Allocation" : "after-nesting-roll-allocation",
    "Associate cutting requirements" : "associate-cutting-requirements",
    "Associate cutting activities" : "associate-cutting-activities",
    "Affect cutting line" : "affect-cutting-line",
    "Publish" : "publish",
    "Assist offloading" : "assist-offloading"
}
// end::mapping[]

export function activityIdFromReference(reference: string): string {
    return ACTIVITIES_MAPPING[reference]
}

export function activityReferenceFromId(id: string): string {
    return Object.entries(ACTIVITIES_MAPPING).find(it => it[1] === id)![0]
}