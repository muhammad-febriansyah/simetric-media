<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Indonesian messages for the validation rules. Field names come from each
    | Form Request's attributes() method.
    |
    */

    'accepted' => ':attribute harus diterima.',
    'accepted_if' => ':attribute harus diterima jika :other adalah :value.',
    'active_url' => ':attribute harus berupa URL yang valid.',
    'after' => ':attribute harus tanggal setelah :date.',
    'after_or_equal' => ':attribute harus tanggal setelah atau sama dengan :date.',
    'alpha' => ':attribute hanya boleh berisi huruf.',
    'alpha_dash' => ':attribute hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
    'alpha_num' => ':attribute hanya boleh berisi huruf dan angka.',
    'array' => ':attribute tidak valid.',
    'ascii' => ':attribute hanya boleh berisi karakter alfanumerik dan simbol satu byte.',
    'before' => ':attribute harus tanggal sebelum :date.',
    'before_or_equal' => ':attribute harus tanggal sebelum atau sama dengan :date.',
    'between' => [
        'array' => ':attribute harus berisi :min sampai :max item.',
        'file' => 'Ukuran :attribute harus antara :min dan :max KB.',
        'numeric' => ':attribute harus antara :min dan :max.',
        'string' => ':attribute harus :min sampai :max karakter.',
    ],
    'boolean' => ':attribute tidak valid.',
    'can' => ':attribute berisi nilai yang tidak diizinkan.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'contains' => ':attribute tidak memuat nilai yang wajib.',
    'current_password' => 'Password salah.',
    'date' => ':attribute harus berupa tanggal yang valid.',
    'date_equals' => ':attribute harus tanggal yang sama dengan :date.',
    'date_format' => ':attribute harus sesuai format :format.',
    'decimal' => ':attribute harus memiliki :decimal angka desimal.',
    'declined' => ':attribute harus ditolak.',
    'declined_if' => ':attribute harus ditolak jika :other adalah :value.',
    'different' => ':attribute dan :other harus berbeda.',
    'digits' => ':attribute harus :digits digit.',
    'digits_between' => ':attribute harus :min sampai :max digit.',
    'dimensions' => 'Dimensi gambar :attribute tidak valid.',
    'distinct' => ':attribute memiliki nilai yang duplikat.',
    'doesnt_end_with' => ':attribute tidak boleh diakhiri dengan: :values.',
    'doesnt_start_with' => ':attribute tidak boleh diawali dengan: :values.',
    'email' => 'Format :attribute tidak valid.',
    'ends_with' => ':attribute harus diakhiri dengan: :values.',
    'enum' => 'Pilihan :attribute tidak valid.',
    'exists' => ':attribute yang dipilih tidak valid.',
    'extensions' => ':attribute harus berekstensi: :values.',
    'file' => ':attribute harus berupa file.',
    'filled' => ':attribute wajib diisi.',
    'gt' => [
        'array' => ':attribute harus berisi lebih dari :value item.',
        'file' => 'Ukuran :attribute harus lebih dari :value KB.',
        'numeric' => ':attribute harus lebih dari :value.',
        'string' => ':attribute harus lebih dari :value karakter.',
    ],
    'gte' => [
        'array' => ':attribute harus berisi minimal :value item.',
        'file' => 'Ukuran :attribute minimal :value KB.',
        'numeric' => ':attribute minimal :value.',
        'string' => ':attribute minimal :value karakter.',
    ],
    'hex_color' => ':attribute harus berupa warna heksadesimal yang valid.',
    'image' => ':attribute harus berupa gambar.',
    'in' => ':attribute yang dipilih tidak valid.',
    'in_array' => ':attribute harus ada di :other.',
    'integer' => ':attribute harus berupa angka.',
    'ip' => ':attribute harus berupa alamat IP yang valid.',
    'ipv4' => ':attribute harus berupa alamat IPv4 yang valid.',
    'ipv6' => ':attribute harus berupa alamat IPv6 yang valid.',
    'json' => ':attribute harus berupa JSON yang valid.',
    'list' => ':attribute harus berupa daftar.',
    'lowercase' => ':attribute harus huruf kecil.',
    'lt' => [
        'array' => ':attribute harus berisi kurang dari :value item.',
        'file' => 'Ukuran :attribute harus kurang dari :value KB.',
        'numeric' => ':attribute harus kurang dari :value.',
        'string' => ':attribute harus kurang dari :value karakter.',
    ],
    'lte' => [
        'array' => ':attribute maksimal berisi :value item.',
        'file' => 'Ukuran :attribute maksimal :value KB.',
        'numeric' => ':attribute maksimal :value.',
        'string' => ':attribute maksimal :value karakter.',
    ],
    'mac_address' => ':attribute harus berupa alamat MAC yang valid.',
    'max' => [
        'array' => ':attribute maksimal berisi :max item.',
        'file' => 'Ukuran :attribute maksimal :max KB.',
        'numeric' => ':attribute maksimal :max.',
        'string' => ':attribute maksimal :max karakter.',
    ],
    'max_digits' => ':attribute maksimal :max digit.',
    'mimes' => ':attribute harus berformat: :values.',
    'mimetypes' => ':attribute harus berformat: :values.',
    'min' => [
        'array' => ':attribute minimal berisi :min item.',
        'file' => 'Ukuran :attribute minimal :min KB.',
        'numeric' => ':attribute minimal :min.',
        'string' => ':attribute minimal :min karakter.',
    ],
    'min_digits' => ':attribute minimal :min digit.',
    'missing' => ':attribute tidak boleh ada.',
    'missing_if' => ':attribute tidak boleh ada jika :other adalah :value.',
    'missing_unless' => ':attribute tidak boleh ada kecuali :other adalah :value.',
    'missing_with' => ':attribute tidak boleh ada jika :values ada.',
    'missing_with_all' => ':attribute tidak boleh ada jika :values ada.',
    'multiple_of' => ':attribute harus kelipatan :value.',
    'not_in' => ':attribute yang dipilih tidak valid.',
    'not_regex' => 'Format :attribute tidak valid.',
    'numeric' => ':attribute harus berupa angka.',
    'password' => [
        'letters' => ':attribute harus berisi minimal satu huruf.',
        'mixed' => ':attribute harus berisi minimal satu huruf besar dan satu huruf kecil.',
        'numbers' => ':attribute harus berisi minimal satu angka.',
        'symbols' => ':attribute harus berisi minimal satu simbol.',
        'uncompromised' => ':attribute ini pernah bocor di internet. Gunakan :attribute lain.',
    ],
    'present' => ':attribute harus ada.',
    'present_if' => ':attribute harus ada jika :other adalah :value.',
    'present_unless' => ':attribute harus ada kecuali :other adalah :value.',
    'present_with' => ':attribute harus ada jika :values ada.',
    'present_with_all' => ':attribute harus ada jika :values ada.',
    'prohibited' => 'Permintaan tidak dapat diproses.',
    'prohibited_if' => ':attribute tidak boleh diisi jika :other adalah :value.',
    'prohibited_if_accepted' => ':attribute tidak boleh diisi jika :other diterima.',
    'prohibited_if_declined' => ':attribute tidak boleh diisi jika :other ditolak.',
    'prohibited_unless' => ':attribute tidak boleh diisi kecuali :other ada di :values.',
    'prohibits' => ':attribute melarang :other diisi.',
    'regex' => 'Format :attribute tidak valid.',
    'required' => ':attribute wajib diisi.',
    'required_array_keys' => ':attribute harus berisi: :values.',
    'required_if' => ':attribute wajib diisi jika :other adalah :value.',
    'required_if_accepted' => ':attribute wajib diisi jika :other diterima.',
    'required_if_declined' => ':attribute wajib diisi jika :other ditolak.',
    'required_unless' => ':attribute wajib diisi kecuali :other ada di :values.',
    'required_with' => ':attribute wajib diisi jika :values ada.',
    'required_with_all' => ':attribute wajib diisi jika :values ada.',
    'required_without' => ':attribute wajib diisi jika :values tidak ada.',
    'required_without_all' => ':attribute wajib diisi jika semua :values tidak ada.',
    'same' => ':attribute dan :other harus sama.',
    'size' => [
        'array' => ':attribute harus berisi :size item.',
        'file' => 'Ukuran :attribute harus :size KB.',
        'numeric' => ':attribute harus :size.',
        'string' => ':attribute harus :size karakter.',
    ],
    'starts_with' => ':attribute harus diawali dengan: :values.',
    'string' => ':attribute harus berupa teks.',
    'timezone' => ':attribute harus zona waktu yang valid.',
    'unique' => ':attribute sudah dipakai.',
    'uploaded' => ':attribute gagal diunggah.',
    'uppercase' => ':attribute harus huruf besar.',
    'url' => 'Format :attribute tidak valid.',
    'ulid' => ':attribute harus ULID yang valid.',
    'uuid' => ':attribute harus UUID yang valid.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | Default Indonesian names for fields used by authentication and settings forms.
    |
    */

    'custom' => [],

    'attributes' => [
        'name' => 'nama',
        'email' => 'email',
        'password' => 'password',
        'password_confirmation' => 'konfirmasi password',
        'current_password' => 'password saat ini',
        'code' => 'kode',
        'recovery_code' => 'kode pemulihan',
    ],

];
