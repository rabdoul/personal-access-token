{{- define  "__ciAnnotations" -}}
    {{- if .Values.ci }}
        {{- if $.Values.ci.metaData }}
{{ $.Values.ci.metaData | toYaml | trim }}
        {{- end }}
    {{- end }}
{{- end -}}